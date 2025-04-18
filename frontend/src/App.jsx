import React, { useState } from 'react';
import './App.css';

const fetchNumbers = async (numberType) => {
  const response = await fetch(`http://localhost:3000/numbers/${numberType}`);
  if (!response.ok) {
    throw new Error('Failed to fetch numbers');
  }
  return await response.json();
};

const App = () => {
  const [numberType, setNumberType] = useState('p'); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchNumbers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching numbers with type:', numberType);
      const result = await fetchNumbers(numberType);
      console.log('Data received from backend:', result);  
      setData(result);  
    } catch (err) {
      console.error('Error fetching numbers:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Average Calculator</h1>
      <div>
        <label>Select Number Type:</label>
        <select value={numberType} onChange={(e) => setNumberType(e.target.value)}>
          <option value="p">Prime</option>
          <option value="f">Fibonacci</option>
          <option value="e">Even</option>
          <option value="r">Random</option>
        </select>
        <button onClick={handleFetchNumbers}>Fetch</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <div>
          <p><strong>Window Previous State:</strong> {JSON.stringify(data.windowPrevState)}</p>
          <p><strong>Window Current State:</strong> {JSON.stringify(data.windowCurrState)}</p>
          <p><strong>Numbers Fetched:</strong> {JSON.stringify(data.numbers)}</p>
          <p><strong>Average:</strong> {data.average}</p>
        </div>
      )}
    </div>
  );
};

export default App;
