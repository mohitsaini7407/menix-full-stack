import { useState, useEffect } from 'react';

const CountdownTimer = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetTime) - new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="countdown-timer">
      <div className="flex space-x-2">
        {timeLeft.days > 0 && (
          <div className="text-center">
            <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
              {formatNumber(timeLeft.days)}
            </div>
            <div className="text-xs text-gray-400 mt-1">Days</div>
          </div>
        )}
        <div className="text-center">
          <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
            {formatNumber(timeLeft.hours)}
          </div>
          <div className="text-xs text-gray-400 mt-1">Hours</div>
        </div>
        <div className="text-center">
          <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
            {formatNumber(timeLeft.minutes)}
          </div>
          <div className="text-xs text-gray-400 mt-1">Mins</div>
        </div>
        <div className="text-center">
          <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
            {formatNumber(timeLeft.seconds)}
          </div>
          <div className="text-xs text-gray-400 mt-1">Secs</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer; 