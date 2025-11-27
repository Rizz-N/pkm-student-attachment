import { useEffect, useState } from "react";

export const useLoading = (value, duration = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const end = parseInt(value);
    if (isNaN(end) || end <= 0) {
      setCount(end);
      return;
    }

    let start = 0;
    const incrementTime = Math.abs(Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value, duration]);
  return count;
};
