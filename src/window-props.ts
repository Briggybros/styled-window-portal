export type WindowProps = {
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
