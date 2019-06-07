import React from 'react';
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
  onClose: ((this: WindowEventHandlers, ev: Event) => any) | null;
  title?: string;
  windowProps?: WindowProps;
  children: Node;
};

class StyledWindowPortal extends React.PureComponent<Props> {
  static defaultProps = {
    onClose: () => {},
    title: 'New Window',
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
        (window.innerHeight - window.outerHeight) / 2 + window.screenY,
      left: (props: WindowProps, window: Window) =>
        (window.innerWidth - window.outerWidth) / 2 + window.screenX,
    },
  };

  private container: HTMLElement;
  private externalWindow: Window | null = null;

  constructor(props: Props) {
    super(props);
    this.container = document.createElement('div');
  }

  componentDidMount() {
    const newWindow = window.open('', '', this.windowPropsToString());

    if (newWindow != null) {
      newWindow.onunload = this.props.onClose;

      const title = newWindow.document.createElement('title');
      title.innerText = !!this.props.title ? this.props.title : '';
      newWindow.document.head.appendChild(title);
      newWindow.document.body.appendChild(this.container);

      // Inject global style
      Array.from(document.head.getElementsByTagName('STYLE'))
        .filter(style =>
          (style as HTMLStyleElement).innerText.startsWith(
            '\n/* sc-component-id: sc-global'
          )
        )
        .forEach(style =>
          newWindow.document.head.appendChild(style.cloneNode(true))
        );

      this.externalWindow = newWindow;
    }
  }

  componentWillUnmount() {
    if (!!this.externalWindow) this.externalWindow.close();
  }

  windowPropsToString() {
    const mergedProps: { [key: string]: any } = {
      ...StyledWindowPortal.defaultProps.windowProps,
      ...this.props.windowProps,
    };

    return Object.keys(mergedProps)
      .map(key => {
        switch (typeof mergedProps[key]) {
          case 'function':
            return `${key}=${mergedProps[key].call(this, mergedProps, window)}`;
          case 'boolean':
            return `${key}=${mergedProps[key] ? 'yes' : 'no'}`;
          default:
            return `${key}=${mergedProps[key]}`;
        }
      })
      .join(',');
  }

  render() {
    if (!!this.externalWindow) {
      return (
        <StyleSheetManager target={this.externalWindow.document.head}>
          <div>
            {ReactDOM.createPortal(this.props.children, this.container)}
          </div>
        </StyleSheetManager>
      );
    } else {
      return null;
    }
  }
}

export default StyledWindowPortal;
