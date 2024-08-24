import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocalStorage } from 'react-use';

export const useErudaDebugger = () => {
  const [searchParams] = useSearchParams();
  const isDebug = searchParams.get('debug');

  const isLocalDebug = window.location.href.includes('localhost');
  const [debug] = useLocalStorage('debug', isDebug || isLocalDebug);

  const erudaInitialized = useRef(false);

  useEffect(() => {
    const initEruda = async () => {
      const eruda = await import('eruda').then((module) => module.default);
      eruda.init();
    };

    if (debug && !erudaInitialized.current) {
      erudaInitialized.current = true;
      initEruda();
    }
  }, [debug]);

  return {
    debug
  };
};
