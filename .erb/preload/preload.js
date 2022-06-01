/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main/preload.ts":
/*!*****************************!*\
  !*** ./src/main/preload.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const fs_1 = __importDefault(__webpack_require__(/*! fs */ "fs"));
const electron_json_storage_1 = __importDefault(__webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'electron-json-storage'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
const electron_1 = __webpack_require__(/*! electron */ "electron");
const utils_1 = __webpack_require__(/*! ../preload/utils */ "./src/preload/utils.ts");
const loading_1 = __webpack_require__(/*! ../preload/loading */ "./src/preload/loading.ts");
// eslint-disable-next-line react-hooks/rules-of-hooks
const { appendLoading, removeLoading } = (0, loading_1.useLoading)();
(async () => {
    await (0, utils_1.domReady)();
    appendLoading();
})();
// --------- Expose some API to the Renderer process. ---------
electron_1.contextBridge.exposeInMainWorld('fs', fs_1.default);
electron_1.contextBridge.exposeInMainWorld('catConfig', electron_json_storage_1.default);
electron_1.contextBridge.exposeInMainWorld('removeLoading', removeLoading);
electron_1.contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(electron_1.ipcRenderer));
electron_1.contextBridge.exposeInMainWorld('danmuApi', {
    onUpdateOnliner: (callback) => electron_1.ipcRenderer.on('update-online', callback),
    onUpdateMsg: (callback) => electron_1.ipcRenderer.on('update-msg', callback),
});
// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(obj) {
    const protos = Object.getPrototypeOf(obj);
    for (const [key, value] of Object.entries(protos)) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
            continue;
        if (typeof value === 'function') {
            // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
            obj[key] = function (...args) {
                return value.call(obj, ...args);
            };
        }
        else {
            obj[key] = value;
        }
    }
    return obj;
}


/***/ }),

/***/ "./src/preload/loading.ts":
/*!********************************!*\
  !*** ./src/preload/loading.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


/* eslint-disable prettier/prettier */
/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
// eslint-disable-next-line import/prefer-default-export
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useLoading = void 0;
// eslint-disable-next-line import/prefer-default-export
function useLoading() {
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
        append(parent, child) {
            if (!Array.from(parent.children).find((e) => e === child)) {
                return parent.appendChild(child);
            }
        },
        // eslint-disable-next-line consistent-return
        remove(parent, child) {
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
exports.useLoading = useLoading;


/***/ }),

/***/ "./src/preload/utils.ts":
/*!******************************!*\
  !*** ./src/preload/utils.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.domReady = void 0;
/** Document ready */
// eslint-disable-next-line import/prefer-default-export
const domReady = (condition = ['complete', 'interactive']) => {
    return new Promise((resolve) => {
        if (condition.includes(document.readyState)) {
            resolve(true);
        }
        else {
            document.addEventListener('readystatechange', () => {
                if (condition.includes(document.readyState)) {
                    resolve(true);
                }
            });
        }
    });
};
exports.domReady = domReady;


/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main/preload.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vcHJlbG9hZC9wcmVsb2FkLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGtFQUFvQjtBQUNwQiwyTkFBOEM7QUFDOUMsbUVBQXNEO0FBQ3RELHNGQUE0QztBQUM1Qyw0RkFBZ0Q7QUFFaEQsc0RBQXNEO0FBQ3RELE1BQU0sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLEdBQUcsd0JBQVUsR0FBRSxDQUFDO0FBRXRELENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDVixNQUFNLG9CQUFRLEdBQUUsQ0FBQztJQUVqQixhQUFhLEVBQUUsQ0FBQztBQUNsQixDQUFDLENBQUMsRUFBRSxDQUFDO0FBRUwsK0RBQStEO0FBQy9ELHdCQUFhLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLFlBQUUsQ0FBQyxDQUFDO0FBQzFDLHdCQUFhLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLCtCQUFTLENBQUMsQ0FBQztBQUN4RCx3QkFBYSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNoRSx3QkFBYSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsc0JBQVcsQ0FBQyxDQUFDLENBQUM7QUFDM0Usd0JBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUU7SUFDMUMsZUFBZSxFQUFFLENBQ2YsUUFBb0UsRUFDcEUsRUFBRSxDQUFDLHNCQUFXLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUM7SUFDOUMsV0FBVyxFQUFFLENBQ1gsUUFBb0UsRUFDcEUsRUFBRSxDQUFDLHNCQUFXLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUM7Q0FDNUMsQ0FBQyxDQUFDO0FBRUgsZ0dBQWdHO0FBQ2hHLFNBQVMsYUFBYSxDQUFDLEdBQXdCO0lBQzdDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFMUMsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDakQsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztZQUFFLFNBQVM7UUFFN0QsSUFBSSxPQUFPLEtBQUssS0FBSyxVQUFVLEVBQUU7WUFDL0IseUhBQXlIO1lBQ3pILEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLEdBQUcsSUFBUztnQkFDL0IsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQztTQUNIO2FBQU07WUFDTCxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQ2xCO0tBQ0Y7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7Ozs7Ozs7Ozs7OztBQzlDRCxzQ0FBc0M7QUFDdEM7Ozs7O0dBS0c7QUFDSCx3REFBd0Q7OztBQUl4RCx3REFBd0Q7QUFDeEQsU0FBZ0IsVUFBVTtJQUN4QixNQUFNLFNBQVMsR0FBRywwQkFBMEIsQ0FBQztJQUM3QyxNQUFNLFlBQVksR0FBRzs7Ozs7OztHQU9wQixTQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBbUJQLENBQUM7SUFDSixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFM0MsTUFBTSxDQUFDLEVBQUUsR0FBRyxtQkFBbUIsQ0FBQztJQUNoQyxNQUFNLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQztJQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLGtCQUFrQixDQUFDO0lBQ3BDLE1BQU0sSUFBSSxHQUFHO1FBQ1gsNkNBQTZDO1FBQzdDLE1BQU0sQ0FBQyxNQUFtQixFQUFFLEtBQWtCO1lBQzVDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTtnQkFDekQsT0FBTyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2xDO1FBQ0gsQ0FBQztRQUNELDZDQUE2QztRQUM3QyxNQUFNLENBQUMsTUFBbUIsRUFBRSxLQUFrQjtZQUM1QyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFO2dCQUN4RCxPQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDbEM7UUFDSCxDQUFDO0tBQ0YsQ0FBQztJQUNGLE9BQU87UUFDTCxhQUFhO1lBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNqQyx5QkFBeUI7WUFDekIsd0VBQXdFO1lBQ3hFLHFCQUFxQjtZQUNyQixnQkFBZ0I7WUFDaEIsb0JBQW9CO1lBQ3BCLHlGQUF5RjtZQUN6RixNQUFNO1FBQ1IsQ0FBQztRQUNELGFBQWE7WUFDWCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25DLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQWxFRCxnQ0FrRUM7Ozs7Ozs7Ozs7Ozs7O0FDOUVELHFCQUFxQjtBQUNyQix3REFBd0Q7QUFDakQsTUFBTSxRQUFRLEdBQUcsQ0FDdEIsWUFBa0MsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLEVBQzdELEVBQUU7SUFDRixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDN0IsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUMzQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDZjthQUFNO1lBQ0wsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtnQkFDakQsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRTtvQkFDM0MsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNmO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBZFcsZ0JBQVEsWUFjbkI7Ozs7Ozs7Ozs7O0FDaEJGOzs7Ozs7Ozs7O0FDQUE7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYXRjYXQtZG0tcmVhY3QvLi9zcmMvbWFpbi9wcmVsb2FkLnRzIiwid2VicGFjazovL2NhdGNhdC1kbS1yZWFjdC8uL3NyYy9wcmVsb2FkL2xvYWRpbmcudHMiLCJ3ZWJwYWNrOi8vY2F0Y2F0LWRtLXJlYWN0Ly4vc3JjL3ByZWxvYWQvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vY2F0Y2F0LWRtLXJlYWN0L2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJlbGVjdHJvblwiIiwid2VicGFjazovL2NhdGNhdC1kbS1yZWFjdC9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZnNcIiIsIndlYnBhY2s6Ly9jYXRjYXQtZG0tcmVhY3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2F0Y2F0LWRtLXJlYWN0L3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2F0Y2F0LWRtLXJlYWN0L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9jYXRjYXQtZG0tcmVhY3Qvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgY2F0Q29uZmlnIGZyb20gJ2VsZWN0cm9uLWpzb24tc3RvcmFnZSc7XG5pbXBvcnQgeyBjb250ZXh0QnJpZGdlLCBpcGNSZW5kZXJlciB9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCB7IGRvbVJlYWR5IH0gZnJvbSAnLi4vcHJlbG9hZC91dGlscyc7XG5pbXBvcnQgeyB1c2VMb2FkaW5nIH0gZnJvbSAnLi4vcHJlbG9hZC9sb2FkaW5nJztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL3J1bGVzLW9mLWhvb2tzXG5jb25zdCB7IGFwcGVuZExvYWRpbmcsIHJlbW92ZUxvYWRpbmcgfSA9IHVzZUxvYWRpbmcoKTtcblxuKGFzeW5jICgpID0+IHtcbiAgYXdhaXQgZG9tUmVhZHkoKTtcblxuICBhcHBlbmRMb2FkaW5nKCk7XG59KSgpO1xuXG4vLyAtLS0tLS0tLS0gRXhwb3NlIHNvbWUgQVBJIHRvIHRoZSBSZW5kZXJlciBwcm9jZXNzLiAtLS0tLS0tLS1cbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ2ZzJywgZnMpO1xuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnY2F0Q29uZmlnJywgY2F0Q29uZmlnKTtcbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ3JlbW92ZUxvYWRpbmcnLCByZW1vdmVMb2FkaW5nKTtcbmNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ2lwY1JlbmRlcmVyJywgd2l0aFByb3RvdHlwZShpcGNSZW5kZXJlcikpO1xuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZCgnZGFubXVBcGknLCB7XG4gIG9uVXBkYXRlT25saW5lcjogKFxuICAgIGNhbGxiYWNrOiAoZXZlbnQ6IEVsZWN0cm9uLklwY1JlbmRlcmVyRXZlbnQsIC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkXG4gICkgPT4gaXBjUmVuZGVyZXIub24oJ3VwZGF0ZS1vbmxpbmUnLCBjYWxsYmFjayksXG4gIG9uVXBkYXRlTXNnOiAoXG4gICAgY2FsbGJhY2s6IChldmVudDogRWxlY3Ryb24uSXBjUmVuZGVyZXJFdmVudCwgLi4uYXJnczogYW55W10pID0+IHZvaWRcbiAgKSA9PiBpcGNSZW5kZXJlci5vbigndXBkYXRlLW1zZycsIGNhbGxiYWNrKSxcbn0pO1xuXG4vLyBgZXhwb3NlSW5NYWluV29ybGRgIGNhbid0IGRldGVjdCBhdHRyaWJ1dGVzIGFuZCBtZXRob2RzIG9mIGBwcm90b3R5cGVgLCBtYW51YWxseSBwYXRjaGluZyBpdC5cbmZ1bmN0aW9uIHdpdGhQcm90b3R5cGUob2JqOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gIGNvbnN0IHByb3RvcyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuXG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHByb3RvcykpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkgY29udGludWU7XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBTb21lIG5hdGl2ZSBBUElzLCBsaWtlIGBOb2RlSlMuRXZlbnRFbWl0dGVyWydvbiddYCwgZG9uJ3Qgd29yayBpbiB0aGUgUmVuZGVyZXIgcHJvY2Vzcy4gV3JhcHBpbmcgdGhlbSBpbnRvIGEgZnVuY3Rpb24uXG4gICAgICBvYmpba2V5XSA9IGZ1bmN0aW9uICguLi5hcmdzOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLmNhbGwob2JqLCAuLi5hcmdzKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ialtrZXldID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmo7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBwcmV0dGllci9wcmV0dGllciAqL1xuLyoqXG4gKiBodHRwczovL3RvYmlhc2FobGluLmNvbS9zcGlua2l0XG4gKiBodHRwczovL2Nvbm5vcmF0aGVydG9uLmNvbS9sb2FkZXJzXG4gKiBodHRwczovL3Byb2plY3RzLmx1a2VoYWFzLm1lL2Nzcy1sb2FkZXJzXG4gKiBodHRwczovL21hdGVqa3VzdGVjLmdpdGh1Yi5pby9TcGluVGhhdFNoaXRcbiAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9wcmVmZXItZGVmYXVsdC1leHBvcnRcblxuaW1wb3J0IExvdHRpZSBmcm9tICdsb3R0aWUtd2ViJztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9wcmVmZXItZGVmYXVsdC1leHBvcnRcbmV4cG9ydCBmdW5jdGlvbiB1c2VMb2FkaW5nKCkge1xuICBjb25zdCBjbGFzc05hbWUgPSBgbG9hZGVycy1jc3NfX3NxdWFyZS1zcGluYDtcbiAgY29uc3Qgc3R5bGVDb250ZW50ID0gYFxuQGtleWZyYW1lcyBzcXVhcmUtc3BpbiB7XG4gIDI1JSB7IHRyYW5zZm9ybTogcGVyc3BlY3RpdmUoMTAwcHgpIHJvdGF0ZVgoMTgwZGVnKSByb3RhdGVZKDApOyB9XG4gIDUwJSB7IHRyYW5zZm9ybTogcGVyc3BlY3RpdmUoMTAwcHgpIHJvdGF0ZVgoMTgwZGVnKSByb3RhdGVZKDE4MGRlZyk7IH1cbiAgNzUlIHsgdHJhbnNmb3JtOiBwZXJzcGVjdGl2ZSgxMDBweCkgcm90YXRlWCgwKSByb3RhdGVZKDE4MGRlZyk7IH1cbiAgMTAwJSB7IHRyYW5zZm9ybTogcGVyc3BlY3RpdmUoMTAwcHgpIHJvdGF0ZVgoMCkgcm90YXRlWSgwKTsgfVxufVxuLiR7Y2xhc3NOYW1lfSA+IGRpdiB7XG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGJvdGg7XG4gIHdpZHRoOiA1MHB4O1xuICBoZWlnaHQ6IDUwcHg7XG4gIGJhY2tncm91bmQ6ICNmZmY7XG4gIGFuaW1hdGlvbjogc3F1YXJlLXNwaW4gM3MgMHMgY3ViaWMtYmV6aWVyKDAuMDksIDAuNTcsIDAuNDksIDAuOSkgaW5maW5pdGU7XG59XG4uYXBwLWxvYWRpbmctd3JhcCB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICB3aWR0aDogMTAwdnc7XG4gIGhlaWdodDogMTAwdmg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBiYWNrZ3JvdW5kOiAjMDAwMDAwO1xuICB6LWluZGV4OiA5O1xufVxuICAgIGA7XG4gIGNvbnN0IG9TdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIGNvbnN0IG9EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICBvU3R5bGUuaWQgPSAnYXBwLWxvYWRpbmctc3R5bGUnO1xuICBvU3R5bGUuaW5uZXJIVE1MID0gc3R5bGVDb250ZW50O1xuICBvRGl2LmNsYXNzTmFtZSA9ICdhcHAtbG9hZGluZy13cmFwJztcbiAgY29uc3Qgc2FmZSA9IHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgICBhcHBlbmQocGFyZW50OiBIVE1MRWxlbWVudCwgY2hpbGQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICBpZiAoIUFycmF5LmZyb20ocGFyZW50LmNoaWxkcmVuKS5maW5kKChlKSA9PiBlID09PSBjaGlsZCkpIHtcbiAgICAgICAgcmV0dXJuIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICB9XG4gICAgfSxcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgICByZW1vdmUocGFyZW50OiBIVE1MRWxlbWVudCwgY2hpbGQ6IEhUTUxFbGVtZW50KSB7XG4gICAgICBpZiAoQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbmQoKGUpID0+IGUgPT09IGNoaWxkKSkge1xuICAgICAgICByZXR1cm4gcGFyZW50LnJlbW92ZUNoaWxkKGNoaWxkKTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xuICByZXR1cm4ge1xuICAgIGFwcGVuZExvYWRpbmcoKSB7XG4gICAgICBzYWZlLmFwcGVuZChkb2N1bWVudC5oZWFkLCBvU3R5bGUpO1xuICAgICAgc2FmZS5hcHBlbmQoZG9jdW1lbnQuYm9keSwgb0Rpdik7XG4gICAgICAvLyBMb3R0aWUubG9hZEFuaW1hdGlvbih7XG4gICAgICAvLyAgIGNvbnRhaW5lcjogb0RpdiwgLy8gdGhlIGRvbSBlbGVtZW50IHRoYXQgd2lsbCBjb250YWluIHRoZSBhbmltYXRpb25cbiAgICAgIC8vICAgcmVuZGVyZXI6ICdzdmcnLFxuICAgICAgLy8gICBsb29wOiB0cnVlLFxuICAgICAgLy8gICBhdXRvcGxheTogdHJ1ZSxcbiAgICAgIC8vICAgcGF0aDogJy9zcmMvYXNzZXRzLzEwMDM0Ny1zY2FyeS1zbGVlcGluZy1jYXQuanNvbicgLy8gdGhlIHBhdGggdG8gdGhlIGFuaW1hdGlvbiBqc29uXG4gICAgICAvLyB9KTtcbiAgICB9LFxuICAgIHJlbW92ZUxvYWRpbmcoKSB7XG4gICAgICBzYWZlLnJlbW92ZShkb2N1bWVudC5oZWFkLCBvU3R5bGUpO1xuICAgICAgc2FmZS5yZW1vdmUoZG9jdW1lbnQuYm9keSwgb0Rpdik7XG4gICAgfSxcbiAgfTtcbn1cblxuXG4iLCIvKiogRG9jdW1lbnQgcmVhZHkgKi9cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvcHJlZmVyLWRlZmF1bHQtZXhwb3J0XG5leHBvcnQgY29uc3QgZG9tUmVhZHkgPSAoXG4gIGNvbmRpdGlvbjogRG9jdW1lbnRSZWFkeVN0YXRlW10gPSBbJ2NvbXBsZXRlJywgJ2ludGVyYWN0aXZlJ11cbikgPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBpZiAoY29uZGl0aW9uLmluY2x1ZGVzKGRvY3VtZW50LnJlYWR5U3RhdGUpKSB7XG4gICAgICByZXNvbHZlKHRydWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdyZWFkeXN0YXRlY2hhbmdlJywgKCkgPT4ge1xuICAgICAgICBpZiAoY29uZGl0aW9uLmluY2x1ZGVzKGRvY3VtZW50LnJlYWR5U3RhdGUpKSB7XG4gICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvbWFpbi9wcmVsb2FkLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9