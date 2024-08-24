import { useEffect } from 'react';

export default function (ref: any, handler: (event: MouseEvent | TouchEvent) => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.body.addEventListener('mousedown', listener);
    document.body.addEventListener('touchstart', listener);

    return () => {
      document.body.removeEventListener('mousedown', listener);
      document.body.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
