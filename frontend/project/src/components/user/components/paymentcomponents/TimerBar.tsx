import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerBarProps {
  initialMinutes: number;
}

const TimerBar: React.FC<TimerBarProps> = ({ initialMinutes }) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const displaySeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  const percentRemaining = (seconds / (initialMinutes * 60)) * 100;

  if (!isVisible) return null;

  return (
    <div className="bg-violet-100 border-y border-violet-200">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-violet-800">
            <Clock className="h-4 w-4 mr-1" />
            <span>Complete payment in <strong>{displayMinutes}:{displaySeconds}</strong></span>
          </div>
          <button 
            onClick={() => setIsVisible(false)} 
            className="text-violet-500 hover:text-violet-700 text-xs"
          >
            Dismiss
          </button>
        </div>
        <div className="w-full h-1 bg-violet-200 mt-1 rounded-full overflow-hidden">
          <div 
            className="h-full bg-violet-600 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${percentRemaining}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TimerBar;