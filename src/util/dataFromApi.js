import axios from 'axios';
import moment from 'moment-timezone';
//import { MY_API_KEY } from './config';
const MY_API_KEY = process.env.REACT_APP_MY_API_KEY;

async function getCoordinates(cityOrCoords) {
  let lat, long, timezone, country, city;

  if (typeof cityOrCoords === 'string') {
    // If cityOrCoords is a string, treat it as a city name
    const response = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityOrCoords}&count=10&language=en&format=json`
    );

    if (!response.data.results || response.data.results.length === 0) {
      return 'cityNotFound';
    }

    lat = response.data.results[0].latitude;
    long = response.data.results[0].longitude;
    timezone = response.data.results[0].timezone;
    country = response.data.results[0].country;
    city = cityOrCoords;
  } else {
    // If cityOrCoords is not a string, treat it as an object with lat and long properties
    lat = cityOrCoords.lat;
    long = cityOrCoords.long;

    // Use OpenCage Geocoding API to get the timezone and country from lat and long
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${MY_API_KEY}`
    );

    console.log('res loc', response);
    timezone = response.data.results[0].annotations.timezone.name;
    country = response.data.results[0].components.country;
    city = response.data.results[0].components.suburb;
  }

  const coordinates = { lat, long, timezone, country, city };
  console.log('ccor ', coordinates);

  return coordinates;
}

export default async function fetchData(cityOrCoords) {
  try {
    const res1 = await getCoordinates(cityOrCoords);
    if (res1 === 'cityNotFound') {
      return res1;
    } else {
      const { lat, long, timezone, country, city } = res1;

      const response = await axios.get(
        'https://api.open-meteo.com/v1/forecast?current=temperature_2m,weathercode,windspeed_10m&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum&timeformat=unixtime&timezone=auto',
        {
          params: {
            latitude: lat,
            longitude: long,
            //timezone: timezone
          },
        }
      );

      const data = response.data;

      const current = parseCurrent(data, timezone);
      const dailyData = parsedaily(data);
      const hourlyData = parsehourly(data);

      return { city, current, dailyData, hourlyData, country };
    }
  } catch (error) {
    console.error('Error fetching data: ', error);
    throw error;
  }
}

function parseCurrent({ current, daily }, timezone) {
  console.log(' parse current called ');
  return {
    currentTemp: Math.round(current.temperature_2m),
    highTemp: Math.round(daily.temperature_2m_max[0]),
    lowTemp: Math.round(daily.temperature_2m_min[0]),
    highFL: Math.round(daily.apparent_temperature_max[0]), //feels like
    lowFL: Math.round(daily.apparent_temperature_min[0]),
    windSpeed: current.windspeed_10m,
    precip: daily.precipitation_sum[0],
    sunrise: daily.sunrise[0],
    sunset: daily.sunset[0],
    iconCode: current.weathercode,
    timezone: timezone,
  };
}

function parsedaily({ daily }) {
  return {
    //they are all arrays
    time: daily.time,
    temp: daily.temperature_2m_max, // we will show the max temp
    weathercode: daily.weathercode,
  };
}
function parsehourly({ hourly }) {
  return {
    temp: hourly.temperature_2m,
    tempFL: hourly.apparent_temperature,
    time: hourly.time,
    weathercode: hourly.weathercode,
    precip: hourly.precipitation,
    windSpeed: hourly.windspeed_10m,
  };
}
