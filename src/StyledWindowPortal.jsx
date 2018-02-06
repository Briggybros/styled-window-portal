// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { StyleSheetManager } from 'styled-components';

type WindowProps = {
    toolbar? : Boolean | (props : WindowProps, window : window) => Boolean,
    location? : Boolean | (props : WindowProps, window : window) => Boolean,
    directories? : Boolean | (props : WindowProps, window : window) => Boolean,
    status? : Boolean| (props : WindowProps, window : window) => Boolean,
    menubar? : Boolean | (props : WindowProps, window : window) => Boolean,
    scrollbars? : Boolean | (props : WindowProps, window : window) => Boolean,
    resizable? : Boolean | (props : WindowProps, window : window) => Boolean,
    width? : Number | (props : WindowProps, window : window) => Number,
    height? : Number | (props : WindowProps, window : window) => Number,
    top? : Number | (props : WindowProps, window : window) => Number,
    left? : Number | (props : WindowProps, window : window) => Number,
}

type Props = {
    onClose? : Function,
    title? : String,
    windowProps? : WindowProps,
    children: Node,
}

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
            top: (props, window) => ((window.innerHeight - props.height) / 2) + window.screenY,
            left: (props, window) => ((window.innerWidth - props.width) / 2) + window.screenX,
        },
    }

    constructor(props) {
        super(props);
        this.container = document.createElement('div');
        this.externalWindow = null;
    }

    componentWillMount() {
        this.externalWindow = window.open('', '', this.windowPropsToString());
    }

    componentDidMount() {
        this.externalWindow.onunload = this.props.onClose;

        const title = this.externalWindow.document.createElement('title');
        title.innerText = this.props.title;
        this.externalWindow.document.head.appendChild(title);
        this.externalWindow.document.body.appendChild(this.container);
    }

    componentWillUnmount() {
        this.externalWindow.close();
    }

    windowPropsToString() {
        const mergedProps = {
            ...StyledWindowPortal.defaultProps.windowProps,
            ...this.props.windowProps,
        };

        return Object.keys(mergedProps).map((key) => {
            switch (typeof mergedProps[key]) {
            case 'function':
                return `${key}=${mergedProps[key].call(this, mergedProps, window)}`;
            case 'boolean':
                return `${key}=${mergedProps[key] ? 'yes' : 'no'}`;
            default:
                return `${key}=${mergedProps[key]}`;
            }
        }).join(',');
    }

    render() {
        return (
            <StyleSheetManager
                taret={this.externalWindow.document.head}
            >
                <div>
                    {ReactDOM.createPortal(this.props.children, this.container)}
                </div>
            </StyleSheetManager>
        );
    }
}

export default StyledWindowPortal;
