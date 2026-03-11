use std::collections::HashMap;
use std::hash::{Hash, Hasher};
use std::fs;
use std::io::Write;
use std::path::PathBuf;
use std::sync::Mutex;

use arboard::Clipboard;
use base64::Engine as _;
use serde::Deserialize;
use serde_json::{Map, Value};
use tauri::Emitter;
use tauri::Manager;
use tauri::Theme;
use tauri::WebviewUrl;
use tauri::WebviewWindowBuilder;
use tauri::WindowEvent;

struct AppState {
  store: Mutex<Map<String, Value>>,
  store_path: PathBuf,
}

#[derive(Clone, Copy)]
struct WindowStateSnapshot {
  x: f64,
  y: f64,
  width: f64,
  height: f64,
}

fn ensure_parent_dir(path: &PathBuf) -> Result<(), String> {
  if let Some(parent) = path.parent() {
    fs::create_dir_all(parent).map_err(|e| e.to_string())?;
  }
  Ok(())
}

fn persist_store(path: &PathBuf, store: &Map<String, Value>) -> Result<(), String> {
  ensure_parent_dir(path)?;
  let data = serde_json::to_string_pretty(store).map_err(|e| e.to_string())?;
  fs::write(path, data).map_err(|e| e.to_string())
}

fn window_state_key(label: &str) -> String {
  format!("window_state_{label}")
}

fn read_window_state(store: &Map<String, Value>, label: &str) -> Option<WindowStateSnapshot> {
  let key = window_state_key(label);
  let Value::Object(raw) = store.get(&key)? else {
    return None;
  };

  Some(WindowStateSnapshot {
    x: raw.get("x")?.as_f64()?,
    y: raw.get("y")?.as_f64()?,
    width: raw.get("width")?.as_f64()?,
    height: raw.get("height")?.as_f64()?,
  })
}

fn save_window_state(
  state: &tauri::State<'_, AppState>,
  label: &str,
  snapshot: WindowStateSnapshot,
) -> Result<(), String> {
  let mut store = state.store.lock().map_err(|e| e.to_string())?;
  store.insert(
    window_state_key(label),
    serde_json::json!({
      "x": snapshot.x,
      "y": snapshot.y,
      "width": snapshot.width,
      "height": snapshot.height,
    }),
  );
  persist_store(&state.store_path, &store)
}

fn capture_window_state(window: &tauri::WebviewWindow) -> Result<WindowStateSnapshot, String> {
  let scale_factor = window.scale_factor().map_err(|e| e.to_string())?;
  let position = window
    .outer_position()
    .map_err(|e| e.to_string())?
    .to_logical::<f64>(scale_factor);
  let size = window
    .inner_size()
    .map_err(|e| e.to_string())?
    .to_logical::<f64>(scale_factor);
  Ok(WindowStateSnapshot {
    x: position.x,
    y: position.y,
    width: size.width,
    height: size.height,
  })
}

fn register_window_state_tracking(
  window: tauri::WebviewWindow,
  label: &'static str,
  app: tauri::AppHandle,
) {
  let tracked_window = window.clone();
  window.on_window_event(move |event| match event {
    WindowEvent::Moved(_) | WindowEvent::Resized(_) | WindowEvent::CloseRequested { .. } => {
      if let Ok(snapshot) = capture_window_state(&tracked_window) {
        let state = app.state::<AppState>();
        let _ = save_window_state(&state, label, snapshot);
      }
    }
    _ => {}
  });
}

fn build_window(
  app: &tauri::AppHandle,
  state: &tauri::State<'_, AppState>,
  label: &str,
  query: &str,
  width: f64,
  height: f64,
  min_width: f64,
  min_height: f64,
  title: &str,
  _transparent: bool,
  decorations: bool,
  resizable: bool,
  always_on_top: bool,
) -> Result<(), String> {
  if app.get_webview_window(label).is_some() {
    return Ok(());
  }

  let url = WebviewUrl::App(format!("index.html?{query}").into());
  let mut builder = WebviewWindowBuilder::new(app, label, url)
    .title(title)
    .inner_size(width, height)
    .min_inner_size(min_width, min_height)
    .decorations(decorations)
    .resizable(resizable)
    .always_on_top(always_on_top);

  if let Some(snapshot) = {
    let store = state.store.lock().map_err(|e| e.to_string())?;
    read_window_state(&store, label)
  } {
    builder = builder
      .position(snapshot.x, snapshot.y)
      .inner_size(snapshot.width, snapshot.height);
  }

  let window = builder.build().map_err(|e| e.to_string())?;
  let static_label = match label {
    "dm" => "dm",
    "live-preview" => "live-preview",
    "plugin" => "plugin",
    "yin" => "yin",
    _ => "",
  };
  if !static_label.is_empty() {
    register_window_state_tracking(window, static_label, app.clone());
  }
  Ok(())
}

#[derive(Deserialize)]
struct SendDanmuPayload {
  value: String,
  roomid: i64,
  #[serde(rename = "SESSDATA")]
  sessdata: String,
  csrf: String,
}

#[derive(Deserialize)]
struct UpdateRoomTitlePayload {
  title: String,
  roomid: i64,
  #[serde(rename = "SESSDATA")]
  sessdata: String,
  csrf: String,
}

#[derive(Deserialize)]
struct HttpGetPayload {
  url: String,
  headers: Option<HashMap<String, String>>,
}

#[tauri::command]
fn store_get(key: String, state: tauri::State<'_, AppState>) -> Value {
  let store = state.store.lock().expect("store poisoned");
  store.get(&key).cloned().unwrap_or(Value::Null)
}

#[tauri::command]
fn store_dump(state: tauri::State<'_, AppState>) -> HashMap<String, Value> {
  let store = state.store.lock().expect("store poisoned");
  store.clone().into_iter().collect()
}

#[tauri::command]
fn store_set(key: String, val: Value, state: tauri::State<'_, AppState>) -> Result<(), String> {
  let mut store = state.store.lock().map_err(|e| e.to_string())?;
  store.insert(key, val);
  persist_store(&state.store_path, &store)
}

#[tauri::command]
fn append_danmu_file(danmu_dir: String, room_id: i64, line: String) -> Result<(), String> {
  if danmu_dir.trim().is_empty() {
    return Ok(());
  }

  let date = chrono_like_date();
  let dir = PathBuf::from(danmu_dir);
  fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
  let path = dir.join(format!("{room_id}-danmu-{date}.txt"));
  let mut file = fs::OpenOptions::new()
    .create(true)
    .append(true)
    .open(path)
    .map_err(|e| e.to_string())?;
  file.write_all(line.as_bytes()).map_err(|e| e.to_string())
}

fn chrono_like_date() -> String {
  let now = std::time::SystemTime::now();
  let dt: chrono::DateTime<chrono::Local> = now.into();
  dt.format("%Y-%m-%d").to_string()
}

#[tauri::command]
fn send_danmu(payload: SendDanmuPayload) -> Result<Value, String> {
  let cookie = format!("SESSDATA={}; bili_jct={};", payload.sessdata, payload.csrf);
  let client = reqwest::blocking::Client::new();
  let rnd = chrono::Local::now().timestamp().to_string();
  let form = [
    ("bubble", "0".to_string()),
    ("msg", payload.value),
    ("color", "16777215".to_string()),
    ("mode", "1".to_string()),
    ("fontsize", "25".to_string()),
    ("rnd", rnd),
    ("roomid", payload.roomid.to_string()),
    ("csrf", payload.csrf.clone()),
    ("csrf_token", payload.csrf),
  ];

  let resp = client
    .post("https://api.live.bilibili.com/msg/send")
    .header("Cookie", cookie)
    .form(&form)
    .send()
    .map_err(|e| e.to_string())?;
  let status = resp.status();
  let text = resp.text().map_err(|e| e.to_string())?;
  if !status.is_success() {
    return Err(format!("send_danmu failed: {status} {text}"));
  }
  serde_json::from_str::<Value>(&text).map_err(|e| e.to_string())
}

#[tauri::command]
fn update_room_title(payload: UpdateRoomTitlePayload) -> Result<Value, String> {
  let cookie = format!("SESSDATA={}; bili_jct={};", payload.sessdata, payload.csrf);
  let client = reqwest::blocking::Client::new();
  let form = [
    ("room_id", payload.roomid.to_string()),
    ("title", payload.title),
    ("csrf", payload.csrf.clone()),
    ("csrf_token", payload.csrf),
  ];

  let resp = client
    .post("https://api.live.bilibili.com/room/v1/Room/update")
    .header("Cookie", cookie)
    .form(&form)
    .send()
    .map_err(|e| e.to_string())?;
  let status = resp.status();
  let text = resp.text().map_err(|e| e.to_string())?;
  if !status.is_success() {
    return Err(format!("update_room_title failed: {status} {text}"));
  }
  serde_json::from_str::<Value>(&text).map_err(|e| e.to_string())
}

#[tauri::command]
fn http_get_json(payload: HttpGetPayload) -> Result<Value, String> {
  let client = reqwest::blocking::Client::new();
  let mut request = client.get(payload.url);
  if let Some(headers) = payload.headers {
    for (k, v) in headers {
      request = request.header(k, v);
    }
  }
  let resp = request.send().map_err(|e| e.to_string())?;
  let status = resp.status();
  let text = resp.text().map_err(|e| e.to_string())?;
  if !status.is_success() {
    return Err(format!("http_get_json failed: {status} {text}"));
  }
  serde_json::from_str::<Value>(&text).map_err(|e| e.to_string())
}

#[tauri::command]
fn cache_avatar(app: tauri::AppHandle, url: String) -> Result<String, String> {
  if url.trim().is_empty() {
    return Err("empty url".to_string());
  }

  let normalized = if url.starts_with("//") {
    format!("https:{url}")
  } else {
    url
  };

  let cache_root = app
    .path()
    .app_cache_dir()
    .map_err(|e| e.to_string())?
    .join("avatars");
  fs::create_dir_all(&cache_root).map_err(|e| e.to_string())?;

  let mut hasher = std::collections::hash_map::DefaultHasher::new();
  normalized.hash(&mut hasher);
  let hash = hasher.finish();

  let lower = normalized.to_lowercase();
  let ext = if lower.contains(".png") {
    "png"
  } else if lower.contains(".webp") {
    "webp"
  } else if lower.contains(".jpeg") || lower.contains(".jpg") {
    "jpg"
  } else {
    "img"
  };
  let file_path = cache_root.join(format!("{hash}.{ext}"));
  if file_path.exists() {
    let bytes = fs::read(&file_path).map_err(|e| e.to_string())?;
    let mime = avatar_mime_by_ext(ext);
    let b64 = base64::engine::general_purpose::STANDARD.encode(bytes);
    return Ok(format!("data:{mime};base64,{b64}"));
  }

  let client = reqwest::blocking::Client::new();
  let resp = client
    .get(&normalized)
    .header(
      "User-Agent",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
    )
    .header("Referer", "https://www.bilibili.com/")
    .send()
    .map_err(|e| e.to_string())?;
  let status = resp.status();
  if !status.is_success() {
    return Err(format!("cache_avatar failed: {status}"));
  }
  let bytes = resp.bytes().map_err(|e| e.to_string())?;
  fs::write(&file_path, &bytes).map_err(|e| e.to_string())?;
  let mime = avatar_mime_by_ext(ext);
  let b64 = base64::engine::general_purpose::STANDARD.encode(bytes.as_ref());
  Ok(format!("data:{mime};base64,{b64}"))
}

fn avatar_mime_by_ext(ext: &str) -> &'static str {
  match ext {
    "png" => "image/png",
    "webp" => "image/webp",
    "jpg" => "image/jpeg",
    _ => "application/octet-stream",
  }
}

#[tauri::command]
fn pick_folder() -> Option<String> {
  rfd::FileDialog::new()
    .pick_folder()
    .map(|path| path.to_string_lossy().to_string())
}

#[tauri::command]
fn ipc_send_message(
  app: tauri::AppHandle,
  channel: String,
  args: Vec<Value>,
  state: tauri::State<'_, AppState>,
) -> Result<(), String> {
  match channel.as_str() {
    "dark-mode:toggle" => {
      let dark = args.first().and_then(|v| v.as_bool()).unwrap_or(false);
      for label in ["main", "dm", "plugin", "yin", "live-preview"] {
        if let Some(win) = app.get_webview_window(label) {
          let _ = win.set_theme(if dark {
            Some(Theme::Dark)
          } else {
            Some(Theme::Light)
          });
        }
      }
    }
    "createDmWindow" => {
      build_window(
        &app,
        &state,
        "dm",
        "dmWindow",
        455.0,
        624.0,
        360.0,
        420.0,
        "Danmu Window",
        true,
        false,
        true,
        false,
      )?;
    }
    "createLivePreview" => {
      build_window(
        &app,
        &state,
        "live-preview",
        "livePreview",
        800.0,
        600.0,
        600.0,
        420.0,
        "Live Preview",
        false,
        true,
        true,
        false,
      )?;
    }
    "createYinWindow" => {
      build_window(
        &app,
        &state,
        "yin",
        "yin",
        1280.0,
        720.0,
        800.0,
        600.0,
        "Yin",
        true,
        false,
        true,
        true,
      )?;
      if let Some(win) = app.get_webview_window("yin") {
        let _ = win.set_fullscreen(true);
      }
    }
    "createPluginWindow" => {
      build_window(
        &app,
        &state,
        "plugin",
        "pluginWindow",
        455.0,
        624.0,
        360.0,
        420.0,
        "Plugin Window",
        true,
        false,
        true,
        false,
      )?;
    }
    "openDmFile" => {
      let store = state.store.lock().map_err(|e| e.to_string())?;
      if let Some(Value::String(path)) = store.get("danmuDir") {
        if !path.is_empty() {
          open::that(path).map_err(|e| e.to_string())?;
        }
      }
    }
    "closeWindow" => {
      for item in args {
        if item == Value::String("dm-close".to_string()) {
          if let Some(win) = app.get_webview_window("dm") {
            let _ = win.close();
          }
        }
        if item == Value::String("main-close".to_string()) {
          if let Some(win) = app.get_webview_window("main") {
            let _ = win.close();
          }
        }
      }
    }
    "minusWindow" => {
      for item in args {
        if item == Value::String("dm-minus".to_string()) {
          if let Some(win) = app.get_webview_window("dm") {
            let _ = win.minimize();
          }
        }
        if item == Value::String("main-minus".to_string()) {
          if let Some(win) = app.get_webview_window("main") {
            let _ = win.minimize();
          }
        }
      }
    }
    "setIgnoreMouseEvents" => {
      // lock window has been removed, keep this channel for compatibility.
    }
    "setOnTop:setting" => {
      if let Some(win) = app.get_webview_window("dm") {
        let always = args
          .first()
          .and_then(|v| v.as_bool())
          .unwrap_or(false);
        let _ = win.set_always_on_top(always);
      }
    }
    "theme:change" => {
      let theme_name = args
        .first()
        .and_then(|v| v.as_str())
        .unwrap_or("light")
        .to_lowercase();
      let native_theme = if theme_name == "dark" {
        Some(Theme::Dark)
      } else {
        Some(Theme::Light)
      };
      for label in ["main", "dm", "plugin", "yin", "live-preview"] {
        if let Some(win) = app.get_webview_window(label) {
          let _ = win.set_theme(native_theme);
        }
      }
      if let Some(win) = app.get_webview_window("dm") {
        let _ = win.emit("theme:change", args.clone());
      }
    }
    "opacity:change" => {
      if let Some(win) = app.get_webview_window("dm") {
        let _ = win.emit("opacity:change", args.clone());
      }
    }
    "app-font:change" => {
      for label in ["main", "live-preview", "yin", "plugin"] {
        if let Some(win) = app.get_webview_window(label) {
          let _ = win.emit("app-font:change", args.clone());
        }
      }
    }
    "dm-font:change" => {
      if let Some(win) = app.get_webview_window("dm") {
        let _ = win.emit("dm-font:change", args.clone());
      }
    }
    "onCopy" => {
      if let Some(text) = args.first().and_then(|v| v.as_str()) {
        let mut clipboard = Clipboard::new().map_err(|e| e.to_string())?;
        clipboard.set_text(text.to_string()).map_err(|e| e.to_string())?;
      }
    }
    "log" => {
      let level = args.first().and_then(|v| v.as_str()).unwrap_or("info");
      let message = args
        .get(1)
        .map(|v| v.to_string())
        .unwrap_or_else(|| "[]".to_string());
      println!("[{level}] {message}");
    }
    _ => {}
  }
  Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let app = tauri::Builder::default()
    .setup(|app| {
      let app_dir = app.path().app_config_dir()?;
      fs::create_dir_all(&app_dir)?;
      let store_path = app_dir.join("catcat-store.json");
      let store = if store_path.exists() {
        let text = fs::read_to_string(&store_path).unwrap_or_else(|_| "{}".to_string());
        serde_json::from_str::<Map<String, Value>>(&text).unwrap_or_default()
      } else {
        Map::new()
      };

      app.manage(AppState {
        store: Mutex::new(store),
        store_path,
      });
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      store_get,
      store_set,
      store_dump,
      append_danmu_file,
      ipc_send_message,
      send_danmu,
      update_room_title,
      http_get_json,
      cache_avatar,
      pick_folder
    ]);

  app
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
