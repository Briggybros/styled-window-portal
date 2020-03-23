# styled-window-portal

If a React portal is used to render to a new window, then styled-components will break as the styles declared are still being appended to the head of the original document. This package combats this by changing the inject point of the style to the head of the new window and copies globally injected styles to the new window.

## Example

```tsx
import React from 'react';
import { render } from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { StyledWindowPortal } from '../../src';

const MyDiv = styled.div`
  background: blue;
`;

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
    }
`;

interface State {
  window: boolean;
}

class App extends React.Component<any, State> {
  constructor(props) {
    super(props);

    this.state = {
      window: false,
    };
  }

  render() {
    return (
      <div>
        <GlobalStyle />
        <button
          onClick={() =>
            this.setState({
              window: !this.state.window,
            })
          }
        >
          Click me to {this.state.window ? 'close' : 'open'} the window
        </button>
        {this.state.window && (
          <StyledWindowPortal
            onClose={() =>
              this.setState({
                window: false,
              })
            }
            autoClose
          >
            <MyDiv>Look, it&apos;s blue! There are no borders either.</MyDiv>
          </StyledWindowPortal>
        )}
      </div>
    );
  }
}
render(<App />, document.getElementById('app'));
```

## Props

The styled window component can take the following props

| Prop Name   | Type     | Default Value | Description                                    |
| ----------- | -------- | ------------- | ---------------------------------------------- |
| onClose     | function | N/A           | A function called when the window is closed    |
| autoClose   | boolean  | false         | Close child window when parent is closed       |
| title       | string   | New Window    | The title of the window                        |
| name        | string   | ' '           | The target attribute or the name of the window |
| windowProps | object   |               | See below                                      |

### windowProps

All values here can either be constant, or functions, the functions have the other options passed to them as the first parameter, and the main window as the second parameter. See descriptions at https://www.w3schools.com/jsref/met_win_open.asp

| Prop Name   | Type                | Default Value     |
| ----------- | ------------------- | ----------------- |
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
