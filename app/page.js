"use client";
import React, { useState, useEffect } from 'react';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  // Fetch weather data by city name
  const getWeatherByCity = (cityName) => {
    setError(''); // Reset error message
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=883533507556126c37b751bd293ed4b2&units=metric`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error('City not found');
        }
        return res.json();
      })
      .then((data) => {
        setWeather(data);
        setError(''); // Reset error message if successful
      })
      .catch((error) => {
        setError("Please enter a valid city name");
        setWeather(null); // Reset weather data
      });
  };

  // Fetch weather data based on geolocation or city name
  const getWeather = () => {
    if (city) {
      getWeatherByCity(city);
    } else {
      setError(''); // Reset error message
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=883533507556126c37b751bd293ed4b2&units=metric`
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error('Invalid location');
            }
            return res.json();
          })
          .then((data) => {
            setWeather(data);
            setError(''); // Reset error message if successful
          })
          .catch((error) => {
            setError("Please enter a valid location");
            setWeather(null); // Reset weather data
          });
      });
    }
  };

  useEffect(() => {
    getWeather();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-5">
      <h1 className="text-4xl font-bold text-blue-900 mb-5">Weather App</h1>
      <div className="mb-4 flex">
        <input
          type='text'
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="shadow appearance-none border rounded py-2 px-3 text-grey-darker mr-2"
          style={{ color: 'black' }}
        />
        <button 
          onClick={getWeather}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Get Weather
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {weather && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-5">
          <h2 className="text-xl mb-2" style={{ color: 'black' }}>{weather.name}</h2>
          <p className="text-gray-700 text-base">Temperature: {weather.main?.temp} °C</p>
          <p className="text-gray-700 text-base">Feels Like: {weather.main?.feels_like} °C</p>
          <p className="text-gray-700 text-base">Humidity: {weather.main?.humidity}%</p>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
