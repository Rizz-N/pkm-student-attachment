import { useEffect, useState, useRef } from "react";

export const useLoading = (value, duration = 800) => {
  const [count, setCount] = useState(0);
  const prevValue = useRef(null);

  useEffect(() => {
    if (value === null || value === undefined) {
      setCount(0);
      return;
    }

    if (prevValue.current === value) {
      setCount(value);
      return;
    }
    prevValue.current = value;

    const end = parseInt(value);
    if (isNaN(end) || end <= 0) {
      setCount(end);
      return;
    }

    let start = 0;
    const totalSteps = Math.min(end, 50);
    const increment = end / totalSteps;
    const interval = duration / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [value, duration]);
  return count;
};
