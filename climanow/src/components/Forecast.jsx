import React from 'react';

export default function Forecast({ data }) {
  return (
    <div className="forecast">
      {data.map((day, index) => (
        <div key={index} className="forecast-day">
          <p>{day.date}</p>
          <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt="clima" />
          <p>{day.temp}°C</p>
        </div>
      ))}
    </div>
  );
}
