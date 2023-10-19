import moment from 'moment-timezone';

export default function checkNight(data) {
  const currentTime = moment().tz(data.current.timezone);
  const sunriseTime = moment
    .unix(data.current.sunrise)
    .tz(data.current.timezone);
  const sunsetTime = moment.unix(data.current.sunset).tz(data.current.timezone);
  // console.log('currentTime : ', currentTime);
  // console.log('sunriseTime : ', sunriseTime);
  // console.log('sunsetTime : ', sunsetTime);

  if (currentTime.isAfter(sunriseTime) && currentTime.isBefore(sunsetTime)) {
    return { bool: false, currentTime, sunriseTime, sunsetTime }; // It's daytime
  } else {
    return { bool: true, currentTime, sunriseTime, sunsetTime }; // It's nighttime
  }
}
