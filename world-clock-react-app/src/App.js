import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [timezoneData, setTimezoneData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimezoneData = async () => {
      try {
        const response = await fetch('http://worldtimeapi.org/api/timezone/Europe/London');
        if (!response.ok) {
          throw new Error('Failed to fetch timezone data');
        }
        const data = await response.json();
        setTimezoneData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimezoneData();
  }, []);

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  if (error) {
    return <div className="App">Error: {error}</div>;
  }

  return (
    <div className="App">
      {timezoneData && (
        <div>
          <p>Timezone: {timezoneData.timezone}</p>
          <p>Datetime: {timezoneData.datetime}</p>
          <p>UTC Offset: {timezoneData.utc_offset}</p>
        </div>
      )}
    </div>
  );
}

export default App;
