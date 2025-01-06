import { useState, useEffect } from 'react';

const OnTimeToday = () => {
  const [onTimeToday, setOnTimeToday] = useState<number | null>(null);

  useEffect(() => {
    const fetchOnTimeToday = async () => {
      try {
        const response = await fetch('/api/onTimeToday');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data);
        if (data.onTimeToday !== undefined) {
          setOnTimeToday(data.onTimeToday);
        }
      } catch (error) {
        console.error('Error fetching on time today:', error);
      }
    };

    fetchOnTimeToday();
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="on-time-today">
      <h3>On Time Today</h3>
      <p>{onTimeToday !== null ? onTimeToday : 'Loading...'}</p>
    </div>
  );
};

export default OnTimeToday;