import { useEffect, useMemo } from 'react';
import { windowPropToNumber } from '../util/window-props-utils';
import { WindowProps } from '../window-props';

export function useWindowSize(windowProps: WindowProps, window?: Window) {
  const width = useMemo(
    () => windowPropToNumber(windowProps.width, windowProps, window),
    [windowProps, window]
  );
  const height = useMemo(
    () => windowPropToNumber(windowProps.height, windowProps, window),
    [windowProps, window]
  );

  useEffect(() => {
    if (!window) return;
    window.resizeTo(width, height);
  }, [window, width, height]);
}
