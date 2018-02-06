# styled-window-portal
A react portal which creates a new window and supports styled-components.

## Example ##

```javascript
import React from 'react';
import { render } from 'react-dom';
import StyledWindowPortal from 'styled-window-portal';

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
                    onClick={() => this.setState({
                        window: true,
                    })}
                >
                    Click me to open a new window
                </button>
                {this.state.window && <StyledWindowPortal
                    onClose={() => this.setState({
                        window: false,
                    })}
                >
                    <div>
                        A new window, OH MY!
                    </div>
                </StyledWindowPortal>}
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
