import React, { useEffect, useState } from 'react';
import './App.css';

const API_KEY = 'f4a84dce793432f2df171ece248115d9'; // Mun Developers' OpenWeatherMap API key

function App() {
  const [location, setLocation] = useState('New York');
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeather(location);
  }, []);

  const fetchWeather = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=40.7128&lon=-74.0060&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();
      setForecast(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch weather data.');
      console.error(err);
    }
  };

  const getBackground = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return 'sunny-bg';
      case 'clouds':
        return 'cloudy-bg';
      case 'rain':
        return 'rainy-bg';
      case 'snow':
        return 'snowy-bg';
      default:
        return 'default-bg';
    }
  };

  return (
    <div className="App">
      {error && <p>{error}</p>}
      {!forecast ? (
        <p>Loading...</p>
      ) : (
        <div className={`weather-container ${getBackground(forecast.current.weather[0].main)}`}>
          <h1>{location}</h1>
          <h2>Current: {forecast.current.temp}°C</h2>
          <h3>{forecast.current.weather[0].main}</h3>

          <div className="forecast">
            {forecast.daily.slice(1, 8).map((day, index) => (
              <div className="forecast-day" key={index}>
                <p>{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <p>{Math.round(day.temp.day)}°C</p>
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

