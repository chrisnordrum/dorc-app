import React, { useState, useEffect } from 'react';

const Quest = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/quests');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); 

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className='text-3xl font-bold'>Quests</h2>
      <ul>
        {data.map(quest => (
          <li key={quest.id}>
            <h3>{quest.title}</h3>
            <p>{quest.description}</p>
            <p>{quest.xpReward}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quest;
