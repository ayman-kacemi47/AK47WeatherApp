import React, { useEffect, useState } from 'react';
import CurrentInfo from './CurrentInfo';
import { getIcon } from '../util/getIcon';
import moment from 'moment-timezone';
import sunriseImg from '../SVGs/sunrise.png';
import sunsetImg from '../SVGs/sunset.png';

const Current = ({ data, moon }) => {
  const {
    currentTemp,
    highFL,
    highTemp,
    iconCode,
    lowFL,
    lowTemp,
    precip,
    sunrise,
    sunset,
    windSpeed,
    timezone,
  } = data.current;

  const [sunriseTime, setSunriseTime] = useState(null);
  const [sunsetTime, setSunsetTime] = useState(null);
  const [CurrentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    const currentTime = moment().tz(timezone);
    const sunriseMoment = moment.unix(sunrise).tz(timezone);
    const sunsetMoment = moment.unix(sunset).tz(timezone);

    setCurrentTime(currentTime.format('HH:mm'));
    setSunriseTime(sunriseMoment.format('HH:mm'));
    setSunsetTime(sunsetMoment.format('HH:mm'));

    let percentage, styleElement;
    if (
      currentTime.isBefore(sunriseMoment) ||
      currentTime.isAfter(sunsetMoment)
    ) {
      percentage = 0;
      // Hide .sunrise::after
      styleElement = document.createElement('style');
      styleElement.textContent = '.sunrise::after { display: none; }';
      document.head.appendChild(styleElement);
    } else {
      const totalDuration = moment
        .duration(sunsetMoment.diff(sunriseMoment))
        .asMinutes();
      const elapsedDuration = moment
        .duration(currentTime.diff(sunriseMoment))
        .asMinutes();
      percentage = (elapsedDuration / totalDuration) * 100;
      // Show .sunrise::after and set borderImageSlice

      styleElement = document.createElement('style');
      styleElement.textContent = `
    .sunrise::after {
     display: block;
      clip-path: inset(0 0 0 ${100 - percentage}%);
    }   
    `;

      document.head.appendChild(styleElement);
    }
  }, [data, sunrise, sunset, timezone]);

  let currentImgSrc = getIcon(iconCode);
  if (moon) {
    currentImgSrc = currentImgSrc.replace('sun', 'moon');
  }

  return (
    <>
      <h2 className='CityTime'>{CurrentTime}</h2>
      <div className='CurrentContainer'>
        <div className='mainSvg'>
          <img
            src={require(`../SVGs/${currentImgSrc}.svg`)} //react has problem with dynamique path , so even put the svg in public or use require()
            alt={currentImgSrc}
          />
          <h2>{currentTemp}°</h2>
        </div>

        <div className='mainInfosContainer'>
          <div className='currentMax'>
            <CurrentInfo title='Température Élevée' data={`${highTemp}°`} />
            <CurrentInfo title='Ressenti Élevé' data={`${highFL}°`} />
            <CurrentInfo title='Vitesse du Vent' data={`${windSpeed} km/h`} />
          </div>
          <div className='currentMin'>
            <CurrentInfo title='Température Basse' data={`${lowTemp}°`} />
            <CurrentInfo title='Ressenti Bas' data={`${lowFL}°`} />
            <CurrentInfo title='Précipitations' data={`${precip} mm`} />
          </div>
          <div className='riseAndSet'>
            <span className='sunrise'>
              <img src={sunriseImg} alt='sunrise' /> <p>{sunriseTime}</p>
            </span>
            <span className='sunset'>
              <img src={sunsetImg} alt='sunset' /> <p>{sunsetTime}</p>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Current;
