import React from 'react';
import * as Icons from 'lucide-react';

const WeatherIcons = ({ icon, size = 24 }) => {
  const getIconComponent = (iconCode) => {
    // OpenWeatherMap icon codes to Lucide icon names mapping
    let iconName;
    
    switch (iconCode) {
      // Clear sky
      case '01d':
      case '01n':
        iconName = 'Sun';
        break;
      
      // Few clouds, scattered clouds
      case '02d':
      case '02n':
      case '03d':
      case '03n':
        iconName = 'Cloud';
        break;
      
      // Broken clouds, overcast
      case '04d':
      case '04n':
        iconName = 'CloudFog';
        break;
      
      // Rain, shower rain
      case '09d':
      case '09n':
        iconName = 'CloudDrizzle';
        break;
      
      // Rain
      case '10d':
      case '10n':
        iconName = 'CloudRain';
        break;
      
      // Thunderstorm
      case '11d':
      case '11n':
        iconName = 'CloudLightning';
        break;
      
      // Snow
      case '13d':
      case '13n':
        iconName = 'Snowflake';
        break;
      
      // Default to sun
      default:
        iconName = 'Sun';
    }
    
    const IconComponent = Icons[iconName];
    return IconComponent ? React.createElement(IconComponent, { size }) : null;
  };

  return getIconComponent(icon);
};

export default WeatherIcons;