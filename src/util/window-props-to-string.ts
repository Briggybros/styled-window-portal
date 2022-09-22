import { WindowProps } from '../window-props';

export function windowPropToString(
  value: WindowProps[string],
  props: WindowProps,
  win: Window
) {
  switch (typeof value) {
    case 'function':
      return value(props, win);
    case 'boolean':
      return value ? 'yes' : 'no';
    default:
      return value;
  }
}

export function windowPropsToString(props: WindowProps, win: Window) {
  return Object.entries(props)
    .map(([key, value]) => `${key}=${windowPropToString(value, props, win)}`)
    .join(',');
}
