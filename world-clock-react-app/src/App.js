import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [timezones, setTimezones] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState('Europe/London');
  const [timezoneData, setTimezoneData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        const response = await fetch('http://worldtimeapi.org/api/timezone');
        if (!response.ok) {
          throw new Error('Failed to fetch timezones');
        }
        const data = await response.json();
        setTimezones(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTimezones();
  }, []);


  useEffect(() => {
    const fetchTimezoneData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://worldtimeapi.org/api/timezone/${selectedTimezone}`);
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
  }, [selectedTimezone]);

  const handleTimezoneChange = (event) => {
    setSelectedTimezone(event.target.value);
  };

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  if (error) {
    return <div className="App">Error: {error}</div>;
  }

  return (
    <div className="App">
      <select value={selectedTimezone} onChange={handleTimezoneChange}>
        {timezones.map((timezone) => (
          <option key={timezone} value={timezone}>
            {timezone}
          </option>
        ))}
      </select>

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
