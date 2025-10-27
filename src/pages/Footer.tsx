import React, { useEffect, useState } from "react";

interface SessionFooterProps {
  tokenExpiresAt: number; // timestamp in milliseconds
}

const SessionFooter: React.FC<SessionFooterProps> = ({ tokenExpiresAt }) => {
  const [timeLeft, setTimeLeft] = useState<number>(tokenExpiresAt - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = tokenExpiresAt - Date.now();
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [tokenExpiresAt]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <footer className="bg-gray-100 text-gray-700 text-sm py-2 px-4 fixed bottom-0 w-full flex justify-between items-center shadow-inner">
      <span>Session expires in: {formatTime(timeLeft)}</span>
      {timeLeft === 0 && <span className="text-red-600 font-semibold">Session expired</span>}
    </footer>
  );
};

export default SessionFooter;
