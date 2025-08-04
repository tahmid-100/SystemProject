import { useState, useEffect } from "react";
import axios from "axios";
import "./Weather.css";

const Weather = ({ lat, lon }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [safetyMessages, setSafetyMessages] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = "e8b3ae0ca1706d0ce06c2a99520d41cb";
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        setWeatherData(response.data);
        analyzeTravelSafety(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [lat, lon]);

  const analyzeTravelSafety = (weatherData) => {
    const safetyThresholds = {
      tempMin: 10,
      tempMax: 35,
      windSpeed: 20,
      visibility: 1000,
      pop: 0.3,
    };

    const messages = [];

    weatherData.list.forEach((forecast) => {
      const { temp } = forecast.main;
      const { speed: windSpeed } = forecast.wind;
      const { visibility } = forecast;
      const { pop } = forecast;
      const { main: weatherCondition } = forecast.weather[0];

      if (temp < safetyThresholds.tempMin || temp > safetyThresholds.tempMax) {
        messages.push(`Extreme temperature (${temp}°C). Take precautions.`);
      }
      if (windSpeed > safetyThresholds.windSpeed) {
        messages.push(`High wind speed (${windSpeed} km/h). Avoid outdoor activities.`);
      }
      if (visibility < safetyThresholds.visibility) {
        messages.push(`Low visibility (${visibility} meters). Drive cautiously.`);
      }
      if (pop > safetyThresholds.pop) {
        messages.push(`High chance of precipitation (${pop * 100}%). Consider postponing travel.`);
      }
      if (weatherCondition === "Thunderstorm" || weatherCondition === "Snow") {
        messages.push(`Severe weather (${weatherCondition}). Avoid travel if possible.`);
      }
    });

    setSafetyMessages([...new Set(messages)]);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  };

  if (loading) {
    return (
      <div className="weather-loading">
        <div className="loading-spinner"></div>
        Loading weather data...
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="weather-loading">
        No weather data available.
      </div>
    );
  }

  const currentWeather = weatherData.list[0];
  const { temp, humidity, pressure } = currentWeather.main;
  const { speed: windSpeed } = currentWeather.wind;
  const { description, icon } = currentWeather.weather[0];

  // Get next 5 forecasts (every 3 hours)
  const forecasts = weatherData.list.slice(1, 6);

  return (
    <div className="weather-container">
      <div className="weather-header">
        <h2 className="weather-title">Weather Forecast</h2>
        <p className="weather-subtitle">Current conditions and 5-day outlook</p>
      </div>

      <div className="weather-content">
        {/* Current Weather */}
        <div className="current-weather">
          <div className="current-weather-content">
            <div className="temperature">{Math.round(temp)}°C</div>
            <div className="description">{description}</div>
            <div className="weather-details">
              <div className="weather-detail">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Humidity: {humidity}%
              </div>
              <div className="weather-detail">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.5 17c0 1.65-1.35 3-3 3s-3-1.35-3-3h2c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1H2v-2h9.5C13.15 14 14.5 15.35 14.5 17zM19 6.5C19 4.57 17.43 3 15.5 3S12 4.57 12 6.5h2C14 5.67 14.67 5 15.5 5S17 5.67 17 6.5 16.33 8 15.5 8H2v2h13.5C17.43 10 19 8.43 19 6.5zM18.5 11H2v2h16.5c.83 0 1.5.67 1.5 1.5S19.33 16 18.5 16v2c1.93 0 3.5-1.57 3.5-3.5S20.43 11 18.5 11z"/>
                </svg>
                Wind: {windSpeed} km/h
              </div>
              <div className="weather-detail">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Pressure: {pressure} hPa
              </div>
            </div>
          </div>
          <div className="weather-icon">
            {getWeatherIcon(icon)}
          </div>
        </div>

        {/* Forecast */}
        <div className="forecast-section">
          <h3 className="forecast-title">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            5-Hour Forecast
          </h3>
          <div className="forecast-list">
            {forecasts.map((forecast, index) => (
              <div key={index} className="forecast-item">
                <div className="forecast-time">
                  {new Date(forecast.dt * 1000).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    hour12: true 
                  })}
                </div>
                <div className="forecast-desc">
                  {forecast.weather[0].description}
                </div>
                <div className="forecast-temp">
                  {Math.round(forecast.main.temp)}°C
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Section */}
      <div className="safety-section">
        <div className="safety-header" onClick={handleExpandClick}>
          <h3 className="safety-title">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Travel Safety
          </h3>
          <button className={`safety-toggle ${expanded ? 'expanded' : ''}`}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
            </svg>
          </button>
        </div>
        <div className={`safety-content ${expanded ? 'expanded' : ''}`}>
          <div className="safety-messages">
            {safetyMessages.length > 0 ? (
              safetyMessages.map((message, index) => (
                <div key={index} className={`safety-message ${message.includes('Extreme') || message.includes('Severe') ? 'danger' : 'warning'}`}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  {message}
                </div>
              ))
            ) : (
              <div className="safety-message success">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Weather conditions are safe for travel.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;