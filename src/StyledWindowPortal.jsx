import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ExternalStyle from 'external-styled-components';

class StyledWindowPortal extends React.PureComponent {
    static propTypes = {
        children: PropTypes.node.isRequired,
        onClose: PropTypes.func,
        windowProps: PropTypes.shape({
            toolbar: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
            location: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
            directories: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
            status: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
            menubar: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
            scrollbars: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
            resizable: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
            width: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
            height: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
            top: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
            left: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
        }),
    }

    static defaultProps = {
        onClose: () => {},
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
            <ExternalStyle
                document={this.externalWindow.document}
            >
                <div>
                    {ReactDOM.createPortal(this.props.children, this.container)}
                </div>
            </ExternalStyle>
        );
    }
}

export default StyledWindowPortal;
