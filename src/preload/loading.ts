/* eslint-disable prettier/prettier */
/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
// eslint-disable-next-line import/prefer-default-export

import Lottie from 'lottie-web';

// eslint-disable-next-line import/prefer-default-export
export function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000;
  z-index: 9;
}
    `;
  const oStyle = document.createElement('style');
  const oDiv = document.createElement('div');

  oStyle.id = 'app-loading-style';
  oStyle.innerHTML = styleContent;
  oDiv.className = 'app-loading-wrap';
  const safe = {
    // eslint-disable-next-line consistent-return
    append(parent: HTMLElement, child: HTMLElement) {
      if (!Array.from(parent.children).find((e) => e === child)) {
        return parent.appendChild(child);
      }
    },
    // eslint-disable-next-line consistent-return
    remove(parent: HTMLElement, child: HTMLElement) {
      if (Array.from(parent.children).find((e) => e === child)) {
        return parent.removeChild(child);
      }
    },
  };
  return {
    appendLoading() {
      safe.append(document.head, oStyle);
      safe.append(document.body, oDiv);
      // Lottie.loadAnimation({
      //   container: oDiv, // the dom element that will contain the animation
      //   renderer: 'svg',
      //   loop: true,
      //   autoplay: true,
      //   path: '/src/assets/100347-scary-sleeping-cat.json' // the path to the animation json
      // });
    },
    removeLoading() {
      safe.remove(document.head, oStyle);
      safe.remove(document.body, oDiv);
    },
  };
}


