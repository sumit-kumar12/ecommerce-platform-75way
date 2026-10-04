"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer({ targetDate, className = "" }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Fallback: 8 hours from now if no targetDate provided
    const target = targetDate ? new Date(targetDate).getTime() : new Date().getTime() + 8 * 60 * 60 * 1000;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;
      
      if (difference <= 0) {
        clearInterval(interval);
        return;
      }
      
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [targetDate]);

  // Prevent hydration mismatch
  if (!isClient) return <div className={`inline-flex items-center gap-1 font-mono text-sm font-semibold bg-primary text-white px-3 py-1.5 rounded-lg shadow-sm ${className}`}>00 : 00 : 00</div>;

  return (
    <div className={`inline-flex items-center gap-1 font-mono text-sm font-semibold bg-primary text-white px-3 py-1.5 rounded-lg shadow-sm ${className}`}>
      <span>{timeLeft.hours}</span>
      <span className="opacity-70">:</span>
      <span>{timeLeft.minutes}</span>
      <span className="opacity-70">:</span>
      <span>{timeLeft.seconds}</span>
    </div>
  );
}
