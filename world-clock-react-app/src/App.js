import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [timezones, setTimezones] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState('Europe/London');
  const [timezoneData, setTimezoneData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);

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
        setCurrentTime(new Date(data.datetime));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimezoneData();
  }, [selectedTimezone]);

  useEffect(() => {
    if (currentTime) {
      const intervalId = setInterval(() => {
        setCurrentTime((prevTime) => new Date(prevTime.getTime() + 1000));
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [currentTime]);

  const handleTimezoneChange = (event) => {
    setSelectedTimezone(event.target.value);
  };

  const formatDatetime = (datetimeString) => {
    const date = new Date(datetimeString);
    return date.toLocaleString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  if (loading) {
    return <div className="App">
      <div className="content-container">
        <p>Loading...</p>
      </div>
    </div>;
  }

  if (error) {
    return <div className="App">
      <div className="content-container">
        <p>Error: {error}</p>
      </div>
    </div>;
  }

  return (
    <div className="App">
      <div className="content-container">
        <h1>World Clock</h1>
        <label htmlFor="timezone-select">Select time zone:</label>
        <select id="timezone-select" value={selectedTimezone} onChange={handleTimezoneChange}>
          {timezones.map((timezone) => (
            <option key={timezone} value={timezone}>
              {timezone}
            </option>
          ))}
        </select>

        {timezoneData && (
          <div>
            <label htmlFor="details-timezone">Timezone:</label>
            <p id="details-timezone">{timezoneData.timezone}</p>
            <label htmlFor="details-time-date">Time and date:</label>
            <p id="details-time-date">{formatDatetime(currentTime)}</p>
            <label htmlFor="details-offset">UTC offset:</label>
            <p id="details-offset">{timezoneData.utc_offset}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
