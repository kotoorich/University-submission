import { useState, useEffect } from 'react'
import weatherService from '../services/weather'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    setWeather(null)
    setError(false)
    weatherService
      .getWeather(capital)
      .then(data => setWeather(data))
      .catch(() => setError(true))
  }, [capital])

  if (error) {
    return <p>Weather data could not be loaded.</p>
  }

  if (!weather) {
    return <p>Loading weather...</p>
  }

  const icon = weather.weather[0].icon

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

export default Weather
