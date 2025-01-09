import { useState, useEffect } from 'react';

const AbsentToday = () => {
  const [absentToday, setAbsentToday] = useState<number | null>(null);

  useEffect(() => {
    const fetchAbsentToday = async () => {
      try {
        const response = await fetch('/api/absentToday');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response in frontend for absentToday:', data); // Debug log
        if (Array.isArray(data.absentRecords)) {
          setAbsentToday(data.absentRecords.length);
        }
      } catch (error) {
        console.error('Error fetching absent today:', error);
      }
    };

    fetchAbsentToday();
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="absent-today">
      <h3>Absent Today</h3>
      <p>{absentToday !== null ? absentToday : 'Loading...'}</p>
    </div>
  );
};

export default AbsentToday;
