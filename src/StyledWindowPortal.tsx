import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
} from 'react';
import ReactDOM from 'react-dom';
import { StyleSheetManager } from 'styled-components';

import { WindowProps } from './window-props';
import { injectGlobalStyle } from './util/inject-global-style';
import { useWindow } from './hooks/use-window';
import { useTitle } from './hooks/use-title';
import { useContainer } from './hooks/use-container';
import { useWindowPosition } from './hooks/use-window-position';

export type StyledWindowPortalProps = PropsWithChildren<{
  onClose?: () => any;
  onOpen?: (win: Window | null) => void;
  target?: string;
  title?: string;
  windowProps?: WindowProps;
}>;

export function StyledWindowPortal({
  children,
  onClose = StyledWindowPortal.defaultProps.onClose,
  onOpen = StyledWindowPortal.defaultProps.onOpen,
  target = StyledWindowPortal.defaultProps.target,
  title = StyledWindowPortal.defaultProps.title,
  windowProps = StyledWindowPortal.defaultProps.windowProps,
}: StyledWindowPortalProps) {
  const winProps = useMemo(
    () => ({ ...StyledWindowPortal.defaultProps.windowProps, ...windowProps }),
    [windowProps]
  );

  // Create window
  const externalWindow = useWindow(target, winProps);

  const containerRef = useContainer(externalWindow);
  useTitle(title, externalWindow);
  useWindowPosition(winProps, externalWindow);

  // Inject styles into window
  useEffect(() => {
    if (!externalWindow) return;

    injectGlobalStyle(externalWindow);
  }, [externalWindow]);

  // Link onClose handler
  useEffect(() => {
    if (!externalWindow) return;
    externalWindow.onunload = onClose;
  }, [externalWindow, onClose]);

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
  target: '',
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
