import { useEffect, useMemo } from 'react';
import { windowPropToString } from '../util/window-props-to-string';
import { WindowProps } from '../window-props';

function getNum(
  prop: WindowProps[string],
  windowProps: WindowProps,
  window?: Window
): number {
  if (!window) return 0;

  const n = Number(windowPropToString(windowProps.left, windowProps, window));

  if (Number.isNaN(n)) return 0;

  return n;
}

export function useWindowPosition(windowProps: WindowProps, window?: Window) {
  const left = useMemo(() => getNum(windowProps.left, windowProps, window), [
    windowProps,
    window,
  ]);
  const top = useMemo(() => getNum(windowProps.top, windowProps, window), [
    windowProps,
    window,
  ]);

  useEffect(() => {
    if (!window) return;
    window.moveTo(left, top);
  }, [window, top, left]);
}
