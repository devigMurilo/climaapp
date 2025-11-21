import React, { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import Loader from './components/Loader';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada no seu navegador.');
      setLoading(false);
      return;
    }

    const fetchJson = async (url) => {
      const res = await fetch(url);
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(`API error ${res.status} ${txt}`);
      }
      return res.json();
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        if (!API_KEY) {
          console.error('VITE_OPENWEATHER_KEY não encontrada.');
          alert('Chave da API ausente. Crie .env com VITE_OPENWEATHER_KEY=SEU_TOKEN e reinicie o dev server.');
          setLoading(false);
          return;
        }

        try {
          const dataWeather = await fetchJson(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br&appid=${API_KEY}`
          );

          setWeather({
            city: dataWeather?.name || '—',
            temp: dataWeather?.main ? Math.round(dataWeather.main.temp) : null,
            description: dataWeather?.weather?.[0]?.description || '',
            icon: dataWeather?.weather?.[0]?.icon || '',
          });

          const dataForecast = await fetchJson(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=pt_br&appid=${API_KEY}`
          );

          let list = (dataForecast.list || []).filter(item => item.dt_txt && item.dt_txt.includes('12:00:00'));

          if (list.length < 5) {
            list = (dataForecast.list || []).filter((_, i) => i % 8 === 0);
          }

          const forecastList = list.slice(0, 5).map(item => ({
            date: item.dt_txt ? item.dt_txt.split(' ')[0] : '',
            temp: item.main ? Math.round(item.main.temp) : null,
            icon: item.weather?.[0]?.icon || '',
          }));

          setForecast(forecastList);
        } catch (err) {
          console.error(err);
          alert('Erro ao obter dados do clima. Veja o console para detalhes.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        alert('Permissão de localização negada ou erro ao obter posição.');
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="container">
      <h1>ClimaNow</h1>
      {loading && <Loader />}
      {weather && <WeatherCard {...weather} />}
      {forecast.length > 0 && <Forecast data={forecast} />}
    </div>
  );
}
