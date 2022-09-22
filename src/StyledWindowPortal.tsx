import React, { ReactNode, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { StyleSheetManager } from 'styled-components';

type WindowProps = {
  toolbar?: Boolean | ((props: WindowProps, window: Window) => Boolean);
  location?: Boolean | ((props: WindowProps, window: Window) => Boolean);
  directories?: Boolean | ((props: WindowProps, window: Window) => Boolean);
  status?: Boolean | ((props: WindowProps, window: Window) => Boolean);
  menubar?: Boolean | ((props: WindowProps, window: Window) => Boolean);
  scrollbars?: Boolean | ((props: WindowProps, window: Window) => Boolean);
  resizable?: Boolean | ((props: WindowProps, window: Window) => Boolean);
  width?: Number | ((props: WindowProps, window: Window) => Number);
  height?: Number | ((props: WindowProps, window: Window) => Number);
  top?: Number | ((props: WindowProps, window: Window) => Number);
  left?: Number | ((props: WindowProps, window: Window) => Number);
};

type Props = {
  onClose?: (() => any);
  onOpen?: ((win: Window | null) => void);
  title?: string;
  name?: string;
  windowProps?: WindowProps;
  children: ReactNode;
};

function windowPropsToString(props: WindowProps) {
  const mergedProps: { [key: string]: any } = {
    ...StyledWindowPortal.defaultProps.windowProps,
    ...props,
  };

  return Object.keys(mergedProps)
    .map(key => {
      switch (typeof mergedProps[key]) {
        case 'function':
          return `${key}=${(mergedProps[key] as Function)(mergedProps, window)}`;
        case 'boolean':
          return `${key}=${mergedProps[key] ? 'yes' : 'no'}`;
        default:
          return `${key}=${mergedProps[key]}`;
      }
    })
    .join(',');
}

function injectGlobalStyle(win: Window) {
  Array.from(document.head.querySelectorAll('style[data-styled]'))
    .forEach(style => {
      win.document.head.appendChild(
        style.cloneNode(true)
      );
    });
}

function StyledWindowPortal({
  name = StyledWindowPortal.defaultProps.name,
  title = StyledWindowPortal.defaultProps.title,
  windowProps = StyledWindowPortal.defaultProps.windowProps,
  onClose = StyledWindowPortal.defaultProps.onClose,
  onOpen = StyledWindowPortal.defaultProps.onOpen,
  children
}: Props) {

  // Window in use
  const [externalWindow, setExternalWindow] = useState<Window | null>(null);
  // Ref to div for portal
  const containerRef = useRef(document.createElement('div'));

  function closeWindow() {
    return externalWindow?.close();
  }

  // On mount, create window
  useEffect(() => {
    const win = window.open(
      '',
      name,
      windowPropsToString(windowProps)
    )

    if (!win) { throw new Error("Failed to open new window") }

    win.onunload = onClose;

    const titleElement = win.document.createElement(
      'title'
    );
    titleElement.innerText = !!title ? title : '';
    win.document.head.appendChild(titleElement);

    win.document.body.appendChild(containerRef.current);

    injectGlobalStyle(win);

    setExternalWindow(win);
  }, []);

  // Close window on this window close
  useEffect(() => {

    if (!!externalWindow) {
      window.addEventListener('beforeunload', closeWindow);
    } else {
      window.removeEventListener('beforeunload', closeWindow);
    }
  }, [externalWindow]);

  // Close window on unmount
  useEffect(() => {
    if (!!externalWindow) {
      return () => {
        closeWindow();
      }
    }
  }, [externalWindow]);

  // Call onOpen with externalWindow if they're defined
  useEffect(() => {
    if (externalWindow && onOpen) {
      onOpen(externalWindow)
    }
  }, [externalWindow, onOpen])

  if (!!externalWindow) {
    return (
      <StyleSheetManager target={externalWindow.document.head}>
        <div>
          {ReactDOM.createPortal(children, containerRef.current)}
        </div>
      </StyleSheetManager>
    );
  } else {
    return null;
  }
}

StyledWindowPortal.defaultProps = {
  onClose: () => { },
  onOpen: undefined,
  title: 'New Window',
  name: '',
  windowProps: {
    toolbar: false,
    location: false,
    directories: false,
    status: false,
    menubar: false,
    scrollbars: true,
    resizable: true,
    width: 500,
    height: 400,
    top: (props: WindowProps, window: Window) =>
      window.screen.height / 2 - window.outerHeight / 2,
    left: (props: WindowProps, window: Window) =>
      window.screen.width / 2 - window.outerWidth / 2,
  },
};

export { StyledWindowPortal };
