import { useEffect, useMemo } from 'react';
import { windowPropToNumber } from '../util/window-props-utils';
import { WindowProps } from '../window-props';

export function useWindowPosition(windowProps: WindowProps, window?: Window) {
  const left = useMemo(
    () => windowPropToNumber(windowProps.left, windowProps, window),
    [windowProps, window]
  );
  const top = useMemo(
    () => windowPropToNumber(windowProps.top, windowProps, window),
    [windowProps, window]
  );

  useEffect(() => {
    if (!window) return;
    window.moveTo(left, top);
  }, [window, top, left]);
}
