# styled-window-portal
If a React portal is used to render to a new window, then styled-components will break as the styles declared are still being appended to the head of the original document. This package combats this by changing the inject point of the style to the head of the new window and copies globally injected styles to the new window.

## Example ##

```jsx
import React from 'react';
import { render } from 'react-dom';
import styled, { injectGlobal } from 'styled-components';
import StyledWindowPortal from 'styled-window-portal';

const MyDiv = styled.div`
    background: blue;
`;

injectGlobal`
    body: {
        margin: 0;
    }
`;

class App() {
    constructor(props) {
        super(props);

        this.state = {
            window: false,
        }
    }

    render() {
        return (
            <div>
                <button
                    onClick={prevState => this.setState({
                        window: !prevState.window,
                    })}
                >
                    Click me to toggle a new window
                </button>
                {this.state.window &&
                    <StyledWindowPortal
                        onClose={() => this.setState({
                            window: false,
                        })}
                    >
                        <MyDiv>
                            Look, it&apos;s blue! There are no borders either.
                        </MyDiv>
                    </StyledWindowPortal>
                }
            </div>
        );
    }
}
render(<App />, document.getElementById('root'));
```

## Props ##

The styled window component can take the following props

| Prop Name   | Type     | Default Value | Description                                 |
|-------------|----------|---------------|---------------------------------------------|
| onClose     | function | N/A           | A function called when the window is closed |
| title       | string   | New Window    | The title of the window                     |
| windowProps | object   |               | See below                                   |

### windowProps ###

All values here can either be constant, or functions, the functions have the other options passed to them as the first parameter, and the main window as the second parameter. See descriptions at https://www.w3schools.com/jsref/met_win_open.asp

| Prop Name   | Type                | Default Value     |
|-------------|---------------------|-------------------|
| toolbar     | boolean \| function | false             |
| location    | boolean \| function | false             |
| directories | boolean \| function | false             |
| menubar     | boolean \| function | false             |
| scrollbars  | boolean \| function | true              |
| resizable   | boolean \| function | true              |
| width       | number \| function  | 500               |
| height      | number \| function  | 400               |
| top         | number \| function  | function (center) |
| left        | number \| function  | function (center) |
