import React from 'react';

export default function WeatherCard({ city, temp, description, icon }) {
  return (
    <div className="weather-card">
      <div>
        <h2>{city}</h2>
        <p>{description}</p>
        <p>{temp}°C</p>
      </div>
      <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="clima" />
    </div>
  );
}
