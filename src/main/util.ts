/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.join(__dirname, '..', '/renderer/', htmlFileName)}`;
  };
}

export let getHTMLPathBySearchKey: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  getHTMLPathBySearchKey = (searchKey: string) => {
    return `http://localhost:${port}${`/?${searchKey}`}`;
  };
} else {
  getHTMLPathBySearchKey = (searchKey: string) => {
    return `file://${path.resolve(
      __dirname,
      `../renderer/index.html?${searchKey}`
    )}`;
  };
}
