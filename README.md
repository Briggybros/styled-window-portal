# styled-window-portal

If a React portal is used to render to a new window, then styled-components will break as the styles declared are still being appended to the head of the original document. This package provides a component which changes the inject point of the style to the head of the new window and copies globally injected styles to the new window.

## [Example](https://github.com/Briggybros/styled-window-portal/blob/master/example/src/index.tsx)

## Props

The styled window component can take the following props

| Prop Name   | Type     | Default Value | Description                                    |
| ----------- | -------- | ------------- | ---------------------------------------------- |
| onClose     | function | N/A           | A function called when the window is closed    |
| onOpen      | function | N/A           | A function called when the window is opened    |
| title       | string   | New Window    | The title of the window                        |
| target      | string   | ' '           | The target attribute or the name of the window |
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
