import { WindowProps } from './window-props';

export function windowPropsToString(props: WindowProps) {
  return Object.entries(props)
    .map(([key, value]) => {
      switch (typeof value) {
        case 'function':
          return `${key}=${value(props, window)}`;
        case 'boolean':
          return `${key}=${value ? 'yes' : 'no'}`;
        default:
          return `${key}=${value}`;
      }
    })
    .join(',');
}
