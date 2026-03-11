import { useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import RouteConfig from './route/RouteConfig';
import './tailwind.css';

const App = () => {
  useEffect(() => {
    const isDmWindow = window.location.search === '?dmWindow';
    const defaultFamily =
      "'SF Pro Display', 'Avenir Next', 'PingFang SC', 'Microsoft YaHei', sans-serif";
    const defaultSize = isDmWindow ? 14 : 14;
    const fontScope = isDmWindow ? 'dm' : 'app';
    const getStoredFontConfig = () => {
      const preset = window.electron.store.get(`${fontScope}FontFamily`);
      const fileData = window.electron.store.get(`${fontScope}FontFileData`);
      const fileName = window.electron.store.get(`${fontScope}FontFileName`);
      const rawSize = window.electron.store.get(`${fontScope}FontSize`);
      return {
        preset,
        fileData,
        fileName,
        size: Number(rawSize) > 0 ? Number(rawSize) : defaultSize,
      };
    };

    const sanitizeFontFamilyName = (value: string) =>
      value.replace(/[^a-zA-Z0-9_-]/g, '_') || 'custom_font';

    const loadFontFromDataUrl = async (fileData: string, fileName?: string) => {
      const familyName = `CatCat_${fontScope}_${sanitizeFontFamilyName(
        fileName || 'font'
      )}`;
      const existingFont = Array.from(document.fonts).find(
        (font) => font.family.replace(/['"]/g, '') === familyName
      );
      if (!existingFont) {
        const fontFace = new FontFace(familyName, `url(${fileData})`);
        await fontFace.load();
        document.fonts.add(fontFace);
      }
      return `'${familyName}', ${defaultFamily}`;
    };

    const applyWindowFont = async (payload?: any) => {
      const stored = getStoredFontConfig();
      const fontFamily = payload?.[0] || stored.preset || defaultFamily;
      const rawSize = payload?.[1] ?? stored.size;
      const fontFileData = payload?.[2] ?? stored.fileData;
      const fontFileName = payload?.[3] ?? stored.fileName;
      const fontSize = Number(rawSize) > 0 ? Number(rawSize) : defaultSize;
      let resolvedFontFamily = String(fontFamily);

      if (
        typeof fontFileData === 'string' &&
        fontFileData.startsWith('data:')
      ) {
        try {
          resolvedFontFamily = await loadFontFromDataUrl(
            fontFileData,
            fontFileName
          );
        } catch (error) {
          console.error('load font file failed', error);
        }
      }

      document.documentElement.style.setProperty(
        '--window-font-family',
        resolvedFontFamily
      );
      document.documentElement.style.setProperty(
        '--window-font-size',
        `${fontSize}px`
      );
    };

    applyWindowFont().catch(() => {});
    if (isDmWindow) {
      window.dmFont.change((_event, data) => {
        applyWindowFont(Array.isArray(data) ? data : [data]).catch(() => {});
      });
    } else {
      window.appFont.change((_event, data) => {
        applyWindowFont(Array.isArray(data) ? data : [data]).catch(() => {});
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<RouteConfig />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
