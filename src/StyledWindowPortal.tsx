import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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
  // Ref to div for portal
  const containerRef = useRef(document.createElement('div'));
  // Title ref
  const titleRef = useRef(document.createElement('title'));

  // Window in use
  const [externalWindow, setExternalWindow] = useState<Window | null>(null);

  // Create window
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

    injectGlobalStyle(win);
    setExternalWindow(win);

    win.addEventListener('beforeunload', () => {
      setExternalWindow(null);
    })

    return () => {
      win?.close();
    };
  }, []);

  // Link onClose handler
  useEffect(() => {
    if (!externalWindow) return;
    externalWindow.onunload = onClose;
  }, [externalWindow, onClose]);

  // Make sure window has title
  useEffect(() => {
    if (!externalWindow) return;

    const existingTitle = externalWindow.document.querySelector('title');

    if (existingTitle === titleRef.current) return;

    if (existingTitle) {
      externalWindow.document.head.removeChild(existingTitle);
    }

    externalWindow.document.head.appendChild(titleRef.current);
  }, [externalWindow, titleRef]);

  // Update title on change
  useEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;

    titleEl.innerText = title;
  }, [title, titleRef]);

  // Make sure window has container
  useEffect(() => {
    if (!externalWindow) return;

    const existingContainer = externalWindow.document.querySelector('body>div');

    if (existingContainer === containerRef.current) return;

    if (existingContainer) {
      externalWindow.document.body.removeChild(existingContainer);
    }

    externalWindow.document.body.appendChild(containerRef.current);
  }, [externalWindow, containerRef]);

  // Close window on this window close
  useEffect(() => {
    const close = () => externalWindow?.close();

    window.addEventListener('beforeunload', close);

    return () => {
      window.removeEventListener('beforeunload', close);
    };
  }, [externalWindow]);

  // Call onOpen with externalWindow if they're defined
  useEffect(() => {
    if (!externalWindow) return;

    onOpen?.(externalWindow);
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
