export function injectGlobalStyle(win: Window) {
  Array.from(document.head.querySelectorAll('style[data-styled]')).forEach(
    style => {
      win.document.head.appendChild(style.cloneNode(true));
    }
  );
}
