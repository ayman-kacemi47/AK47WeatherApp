import React from 'react';
import moment from 'moment-timezone';
import { getIcon } from '../util/getIcon';

const TimeElement = ({
  precip,
  temp,
  weathercode,
  windSpeed,
  tempFL,
  time,
  moon,
  zoneTime,
  checkNight,
}) => {
  let currentImgSrc = getIcon(weathercode);

  //check if it's day or night
  const currentTime = moment.unix(time).format('HH:mm');
  const sunriseTime = checkNight.sunriseTime.format('HH:mm');
  const sunsetTime = checkNight.sunsetTime.format('HH:mm');

  if (currentTime < sunriseTime || currentTime > sunsetTime) {
    currentImgSrc = currentImgSrc.replace('sun', 'moon');
  }

  return (
    <div className='TimeContainer'>
      <ul className='ul-ByTime'>
        <li>
          {moment.unix(time).format('DD/MM')} <br />{' '}
          {moment.unix(time).format('HH')}:00
        </li>
        <li>
          <img
            src={require(`../SVGs/${currentImgSrc}.svg`)}
            alt={currentImgSrc}
          />
        </li>
        <li>
          Temp <br /> {Math.round(temp)} °
        </li>
        <li>
          T.ress <br /> {Math.round(tempFL)} °
        </li>
        <li>
          V.vent <br /> {windSpeed} km/h
        </li>
        <li>
          Précip <br /> {precip} mm
        </li>
      </ul>
    </div>
  );
};

export default TimeElement;
