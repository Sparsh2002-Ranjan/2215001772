export default function ResultDisplay({ data }) {
    return (
      <div className="result-box">
        <h2>Response</h2>
        <p><strong>Window Previous State:</strong> {JSON.stringify(data.windowPrevState)}</p>
        <p><strong>Window Current State:</strong> {JSON.stringify(data.windowCurrState)}</p>
        <p><strong>Numbers Fetched:</strong> {JSON.stringify(data.numbers)}</p>
        <p><strong>Average:</strong> {data.average}</p>
      </div>
    );
  }
  