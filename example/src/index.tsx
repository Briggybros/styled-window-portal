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
  autoClose: boolean;
}

class App extends React.Component<any, State> {
  constructor(props) {
    super(props);

    this.state = {
      window: false,
      autoClose: false,
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

        <p>
          <label>
            <input
              type="checkbox"
              checked={this.state.autoClose}
              onChange={() =>
                this.setState({
                  autoClose: !this.state.autoClose,
                })
              }
            />
            Auto close child window when parent is closed
          </label>
        </p>

        {this.state.window && (
          <StyledWindowPortal
            onClose={() =>
              this.setState({
                window: false,
              })
            }
            autoClose={this.state.autoClose}
          >
            <MyDiv>Look, it&apos;s blue! There are no borders either.</MyDiv>
          </StyledWindowPortal>
        )}
      </div>
    );
  }
}
render(<App />, document.getElementById('app'));
