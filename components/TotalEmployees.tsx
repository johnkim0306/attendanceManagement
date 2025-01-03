// components/TotalEmployees.tsx

import { useState, useEffect } from 'react';

const TotalEmployees = () => {
  const [totalEmployees, setTotalEmployees] = useState<number | null>(null);

  useEffect(() => {
    // Fetch the total number of employees from the API
    const fetchTotalEmployees = async () => {
      try {
        const response = await fetch('/api/totalEmployees');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Response:', data); // Add this line
        if (data.totalEmployees !== undefined) {
          setTotalEmployees(data.totalEmployees);
        }
      } catch (error) {
        console.error('Error fetching total employees:', error);
      }
    };

    fetchTotalEmployees();
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="total-employees">
      <h3>Total Employees in the Company</h3>
      <p>{totalEmployees !== null ? totalEmployees : 'Loading...'}</p>
    </div>
  );
};

export default TotalEmployees;
