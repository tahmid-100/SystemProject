import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Collapse,
  IconButton,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WeatherIcons from "./WeatherIcons"; // Custom component for weather icons

Chart.register(...registerables);

const Weather = ({ lat, lon }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [safetyMessages, setSafetyMessages] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = "e8b3ae0ca1706d0ce06c2a99520d41cb"; // Replace with your OpenWeatherMap API key
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
      tempMin: 10, // Minimum safe temperature in °C
      tempMax: 35, // Maximum safe temperature in °C
      windSpeed: 20, // Maximum safe wind speed in km/h
      visibility: 1000, // Minimum safe visibility in meters
      pop: 0.3, // Maximum safe probability of precipitation (30%)
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!weatherData) {
    return (
      <Typography variant="body1" align="center" mt={4}>
        No weather data available.
      </Typography>
    );
  }

  const currentWeather = weatherData.list[0];
  const { temp, humidity, pressure } = currentWeather.main;
  const { speed: windSpeed } = currentWeather.wind;
  const { description, icon } = currentWeather.weather[0];

  // Chart data for temperature trend
  const temperatureChartData = {
    labels: weatherData.list.map((item) => item.dt_txt),
    datasets: [
      {
        label: "Temperature (°C)",
        data: weatherData.list.map((item) => item.main.temp),
        borderColor: theme.palette.primary.main,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  // Chart data for precipitation probability
  const precipitationChartData = {
    labels: weatherData.list.map((item) => item.dt_txt),
    datasets: [
      {
        label: "Precipitation Probability (%)",
        data: weatherData.list.map((item) => item.pop * 100),
        backgroundColor: theme.palette.secondary.main,
      },
    ],
  };

  return (
    <Box sx={{ mt: 4, p: 3, background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)", borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Weather Forecast
      </Typography>

      {/* Current Weather Card */}
      <Card sx={{ mb: 3, background: "rgba(255, 255, 255, 0.8)" }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h5">{temp}°C</Typography>
              <Typography variant="body1">{description}</Typography>
              <Typography variant="body2">Humidity: {humidity}%</Typography>
              <Typography variant="body2">Wind: {windSpeed} km/h</Typography>
              <Typography variant="body2">Pressure: {pressure} hPa</Typography>
            </Box>
            <WeatherIcons icon={icon} size={64} />
          </Box>
        </CardContent>
      </Card>

      {/* Temperature Trend Chart */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Temperature Trend
        </Typography>
        <Line data={temperatureChartData} />
      </Box>

      {/* Precipitation Probability Chart */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Precipitation Probability
        </Typography>
        <Bar data={precipitationChartData} />
      </Box>

      {/* Travel Safety Analysis */}
      <Card sx={{ background: "rgba(255, 255, 255, 0.8)" }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Travel Safety</Typography>
            <IconButton onClick={handleExpandClick}>
              <ExpandMoreIcon sx={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }} />
            </IconButton>
          </Box>
          <Collapse in={expanded}>
            {safetyMessages.length > 0 ? (
              safetyMessages.map((message, index) => (
                <Typography key={index} variant="body2" color="error" sx={{ mt: 1 }}>
                  {message}
                </Typography>
              ))
            ) : (
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                Weather conditions are safe for travel.
              </Typography>
            )}
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Weather;