import axios from 'axios'

const apiKey = import.meta.env.VITE_WEATHER_KEY

const getWeather = (capital) => {
  return axios
    .get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: capital,
        appid: apiKey,
        units: 'metric'
      }
    })
    .then(response => response.data)
}

export default { getWeather }
