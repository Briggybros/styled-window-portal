type WindowPropFactory<T> = (props: WindowProps, window: Window) => T;
type WindowProp<T> = T | WindowPropFactory<T>;

export type WindowProps = {
  /**
   * Whether or not to display the browser toolbar. IE and Firefox only.
   */
  toolbar?: WindowProp<boolean>;

  /**
   * Whether or not to display the address field. Opera only.
   */
  location?: WindowProp<boolean>;

  /**
   * 	Whether or not to add a status bar.
   */
  status?: WindowProp<boolean>;

  /**
   * Whether or not to display the menu bar.
   */
  menubar?: WindowProp<boolean>;

  /**
   * Whether or not to display scroll bars. IE, Firefox & Opera only.
   */
  scrollbars?: WindowProp<boolean>;

  /**
   * Whether or not the window is resizable. IE only.
   */
  resizable?: WindowProp<boolean>;

  /**
   * The width of the window. Min. value is 100.
   */
  width?: WindowProp<number>;

  /**
   * 	The height of the window. Min. value is 100.
   */
  height?: WindowProp<number>;

  /**
   * The top position of the window. Negative values not allowed.
   */
  top?: WindowProp<number>;

  /**
   * The left position of the window. Negative values not allowed.
   */
  left?: WindowProp<number>;

  [key: string]: WindowProp<boolean | number | string> | undefined;
};
