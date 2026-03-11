import { invoke } from '@tauri-apps/api/core';

export async function tauriGetJson(
  url: string,
  headers?: Record<string, string>
): Promise<any> {
  return invoke('http_get_json', {
    payload: {
      url,
      headers: headers || null,
    },
  });
}

const avatarCacheMap = new Map<string, Promise<string>>();

function normalizeAvatarUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  return url;
}

function isTauriRuntime(): boolean {
  return typeof window !== 'undefined' && Boolean((window as any).__TAURI_INTERNALS__);
}

export async function cacheAvatarSrc(url: string): Promise<string> {
  const normalized = normalizeAvatarUrl(url);
  if (!normalized) return '';
  if (!isTauriRuntime()) return normalized;

  const cached = avatarCacheMap.get(normalized);
  if (cached) return cached;

  const task = invoke<string>('cache_avatar', { url: normalized })
    .then((dataUrl) => dataUrl)
    .catch(() => normalized);

  avatarCacheMap.set(normalized, task);
  return task;
}
