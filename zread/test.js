// test/index.js

exports.html = function () {
  console.log('Inside html function');
  return `<div id="hello-world-container">Click me!</div>`;
};

// 导出一个函数，该函数添加事件监听器或其他与插件相关的功能
exports.events = function () {
  console.log('Inside events function');

  // 在 DOM 中获取 hello-world-container 元素
  // 请注意，在主进程（Node.js）中，不能直接使用 document 对象
  // 如果需要模拟 DOM 操作，可以使用 Electron 的 remote 模块 
  const container = document.getElementById('hello-world-container');

  // 添加点击事件监听器
  container.addEventListener('click', handleClick);

  // 添加其他事件监听器或功能
   container.addEventListener('mouseover', handleMouseOver);

   function handleClick() {
    alert('Hello World Clicked!');
  }

  function handleMouseOver() {
    console.log('Mouse over the Hello World container!');
  }
};

// 修正导出，避免使用 this 关键字
module.exports = {
  html: exports.html,
  events: exports.events,
};
