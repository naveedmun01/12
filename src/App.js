import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = "f4a84dce793432f2df171ece248115d9";

function App() {
  const [forecast, setForecast] = useState(null);
  const [location, setLocation] = useState("Loading...");
  const [error, setError] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`);
          setForecast(res.data);
          const locRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
          setLocation(locRes.data.name);
        } catch (err) {
          setError("Failed to fetch forecast.");
        }
      },
      () => setError("Geolocation not allowed.")
    );
  }, []);

  const getBackground = (main) => {
    if (main.includes("Rain")) return "rainy";
    if (main.includes("Cloud")) return "cloudy";
    if (main.includes("Clear")) return "sunny";
    if (main.includes("Snow")) return "snowy";
    return "default";
  };

  return (
    <div className="app">
      {error && <p>{error}</p>}
      {!forecast ? <p>Loading...</p> : (
        <div className={\`weather-container \${getBackground(forecast.current.weather[0].main)}\`}>
          <h1>{location}</h1>
          <h2>Current: {forecast.current.temp}°C</h2>
          <h3>{forecast.current.weather[0].main}</h3>
          <h2>7-Day Forecast</h2>
          <div className="forecast">
            {forecast.daily.slice(0, 7).map((day, idx) => (
              <div key={idx} className="day">
                <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
                <p>{day.temp.day}°C</p>
                <p>{day.weather[0].main}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
