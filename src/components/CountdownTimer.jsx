import { useState, useEffect } from "react";

export default function CountdownTimer({ endTime, callback }) {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;
      if (remaining > 0) {
        setRemainingTime(remaining);
      } else {
        setRemainingTime(0);
        clearInterval(intervalId);
        // Handling when the timer runs out
        callback();
      }
      // Change this to 10 or 100 milliseconds if performance is an issue
    }, 1);

    return () => {
      clearInterval(intervalId);
    };
  }, [endTime]);

  // Pad for even formatting SS:MMM (S = seconds, M = milliseconds)
  const seconds = String(Math.floor(remainingTime / 1000)).padStart(2, "0");
  const milliseconds = String(remainingTime % 1000).padStart(3, "0");

  return (
    <div
      className={`countdown-timer ${remainingTime < 10000 ? "flash-red" : ""}`}
    >
      <h1>
        {seconds}:{milliseconds}
      </h1>
    </div>
  );
}
