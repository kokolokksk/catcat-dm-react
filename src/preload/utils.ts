/** Document ready */
// eslint-disable-next-line import/prefer-default-export
export const domReady = (
  condition: DocumentReadyState[] = ['complete', 'interactive']
) => {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
};
