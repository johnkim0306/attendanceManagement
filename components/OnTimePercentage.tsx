import { useState, useEffect } from 'react';

const OnTimePercentage = () => {
  const [onTimePercentage, setOnTimePercentage] = useState<number | null>(null);

  useEffect(() => {
    const fetchOnTimePercentage = async () => {
      try {
        const response = await fetch('/api/onTimePercentage');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data);
        if (data.onTimePercentage !== undefined) {
          setOnTimePercentage(data.onTimePercentage);
        }
      } catch (error) {
        console.error('Error fetching on-time percentage:', error);
      }
    };

    fetchOnTimePercentage();
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="on-time-percentage">
      <h3>On-Time Percentage</h3>
      <p>{onTimePercentage !== null ? `${onTimePercentage.toFixed(2)}%` : 'Loading...'}</p>
    </div>
  );
};

export default OnTimePercentage;