import { MutableRefObject, useEffect, useRef } from 'react';

export function useContainer(win?: Window): MutableRefObject<HTMLDivElement> {
  // Ref to div for portal
  const containerRef = useRef(document.createElement('div'));

  // Make sure window has container
  useEffect(() => {
    if (!win) return;

    const existingContainer = win.document.querySelector('body>div');

    if (existingContainer === containerRef.current) return;

    if (existingContainer) {
      win.document.body.removeChild(existingContainer);
    }

    win.document.body.appendChild(containerRef.current);
  }, [win, containerRef]);

  return containerRef;
}
