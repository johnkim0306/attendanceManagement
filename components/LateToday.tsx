import { useState, useEffect } from 'react';

const LateToday = () => {
  const [lateToday, setLateToday] = useState<number | null>(null);

  useEffect(() => {
    const fetchLateToday = async () => {
      try {
        const response = await fetch('/api/lateToday');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data);
        if (data.lateToday !== undefined) {
          setLateToday(data.lateToday);
        }
      } catch (error) {
        console.error('Error fetching late today:', error);
      }
    };

    fetchLateToday();
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="late-today">
      <h3>Late Today</h3>
      <p>{lateToday !== null ? lateToday : 'Loading...'}</p>
    </div>
  );
};

export default LateToday;