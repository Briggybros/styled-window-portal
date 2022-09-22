import React, { useEffect, useMemo, useState } from 'react';
import { render } from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { useInterval } from 'usehooks-ts';
import { StyledWindowPortal, WindowProps } from '../../src';

const MyDiv = styled.div`
  background: blue;
`;

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
    }
`;

function App() {
  const [window, setWindow] = useState(false);

  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(count => (count + 1) % 100);
  }, 500);

  const title = useMemo(() => `Title: ${count}`, [count]);

  const windowProps = useMemo<WindowProps>(
    () => ({
      left: count,
      top: count,
      width: 500 + count,
      height: 400 + count,
    }),
    [count]
  );

  return (
    <div>
      <GlobalStyle />
      <button onClick={() => setWindow(win => !win)}>
        Click me to {window ? 'close' : 'open'} the window
      </button>

      {window && (
        <StyledWindowPortal
          title={title}
          windowProps={windowProps}
          onClose={() => setWindow(false)}
        >
          <MyDiv>Look, it&apos;s blue! There are no borders either.</MyDiv>
        </StyledWindowPortal>
      )}
    </div>
  );
}

render(<App />, document.getElementById('app'));
