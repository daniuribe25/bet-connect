import { useEffect, useRef } from 'react';

const useInterval = (callback, delay = 1000) => {
  const memoisedCallback = useRef();

  useEffect(() => {
    memoisedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (...args) => memoisedCallback.current(...args);
    const id = setInterval(handler, delay);
    return () => clearInterval(id);
  }, [delay]);
};

export default useInterval;
