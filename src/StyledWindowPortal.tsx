import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { StyleSheetManager } from 'styled-components';

import { WindowProps } from './window-props';
import { windowPropsToString } from './window-props-to-string';
import { injectGlobalStyle } from './inject-global-style';

export type StyledWindowPortalProps = PropsWithChildren<{
  onClose?: () => any;
  onOpen?: (win: Window | null) => void;
  title?: string;
  name?: string;
  windowProps?: WindowProps;
}>;

export function StyledWindowPortal({
  name = StyledWindowPortal.defaultProps.name,
  title = StyledWindowPortal.defaultProps.title,
  windowProps = StyledWindowPortal.defaultProps.windowProps,
  onClose = StyledWindowPortal.defaultProps.onClose,
  onOpen = StyledWindowPortal.defaultProps.onOpen,
  children,
}: StyledWindowPortalProps) {
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
      windowPropsToString({
        ...StyledWindowPortal.defaultProps.windowProps,
        ...windowProps,
      })
    );

    if (!win) {
      throw new Error('Failed to open new window');
    }

    win.onunload = onClose;

    const titleElement = win.document.createElement('title');
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
      };
    }
  }, [externalWindow]);

  // Call onOpen with externalWindow if they're defined
  useEffect(() => {
    if (externalWindow && onOpen) {
      onOpen(externalWindow);
    }
  }, [externalWindow, onOpen]);

  if (!!externalWindow) {
    return (
      <StyleSheetManager target={externalWindow.document.head}>
        <div>{ReactDOM.createPortal(children, containerRef.current)}</div>
      </StyleSheetManager>
    );
  } else {
    return null;
  }
}

StyledWindowPortal.defaultProps = {
  onClose: () => {},
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
