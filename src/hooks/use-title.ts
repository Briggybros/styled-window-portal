import { MutableRefObject, useEffect, useRef } from 'react';

export function useTitle(
  title: string,
  win?: Window
): MutableRefObject<HTMLTitleElement> {
  // Title ref
  const titleRef = useRef(document.createElement('title'));

  // Make sure window has title
  useEffect(() => {
    if (!win) return;

    const existingTitle = win.document.querySelector('title');

    if (existingTitle === titleRef.current) return;

    if (existingTitle) {
      win.document.head.removeChild(existingTitle);
    }

    win.document.head.appendChild(titleRef.current);
  }, [win, titleRef]);

  // Update title on change
  useEffect(() => {
    const titleEl = titleRef.current;
    if (!titleEl) return;

    titleEl.innerText = title;
  }, [title, titleRef]);

  return titleRef;
}
