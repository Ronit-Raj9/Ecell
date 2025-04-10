'use client';

import { useEffect, useState } from 'react';
import { getEventTimeRemaining } from '@/utils/eventHelpers';

interface CountdownTimerProps {
  date: string;
}

export default function CountdownTimer({ date }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(getEventTimeRemaining(date));
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      const newTimeRemaining = getEventTimeRemaining(date);
      setTimeRemaining(newTimeRemaining);
      
      // Stop the timer if the event has passed
      if (newTimeRemaining.days === 0 && 
          newTimeRemaining.hours === 0 && 
          newTimeRemaining.minutes === 0) {
        setIsRunning(false);
      }
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [date, isRunning]);

  return (
    <div className="flex items-center space-x-2 text-sm font-medium">
      <div className="flex flex-col items-center">
        <span className="text-xl font-bold text-white">{timeRemaining.days}</span>
        <span className="text-xs text-white/70">Days</span>
      </div>
      <div className="text-white">:</div>
      <div className="flex flex-col items-center">
        <span className="text-xl font-bold text-white">{timeRemaining.hours}</span>
        <span className="text-xs text-white/70">Hours</span>
      </div>
      <div className="text-white">:</div>
      <div className="flex flex-col items-center">
        <span className="text-xl font-bold text-white">{timeRemaining.minutes}</span>
        <span className="text-xs text-white/70">Mins</span>
      </div>
    </div>
  );
} 