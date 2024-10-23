import './App.css';
import { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  if (error) {
    return <div className="App">Error: {error}</div>;
  }

  return (
    <div className="App">
    </div>
  );
}

export default App;
