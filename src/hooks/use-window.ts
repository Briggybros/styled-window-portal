import { useEffect, useState } from 'react';
import { WindowProps } from '../window-props';
import { windowPropsToString } from '../util/window-props-utils';

export function useWindow(
  target: string,
  props: WindowProps
): Window | undefined {
  const [win, setWindow] = useState<Window | undefined>(undefined);

  // Create window
  useEffect(() => {
    const _win = window.open('', target, windowPropsToString(props, window));

    if (!_win) {
      throw new Error('Failed to open new window');
    }

    setWindow(_win);

    _win.addEventListener('beforeunload', () => {
      setWindow(undefined);
    });

    return () => {
      _win?.close();
    };
  }, []);

  // Close window on this window close
  useEffect(() => {
    const close = () => win?.close();

    window.addEventListener('beforeunload', close);

    return () => {
      window.removeEventListener('beforeunload', close);
    };
  }, [win]);

  return win;
}
