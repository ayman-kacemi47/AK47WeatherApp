import React from 'react';
import { getIcon } from '../util/getIcon';
import moment from 'moment';
import 'moment/locale/fr'; //to use fr days

function DayCard({ index, time, temp, weathercode }) {
  let day;
  if (index === 0) {
    day = "Aujourd'hui";
  } else if (index === 1) {
    day = 'Demin';
  } else {
    moment.locale('fr');
    day = moment.unix(time).format('dddd');
  }

  return (
    <div className='dayCard'>
      <div className='dayCardSvg'>
        <img
          src={require(`../SVGs/${getIcon(weathercode)}.svg`)}
          alt={getIcon(weathercode)}
        />
      </div>
      <h2>{day}</h2>
      <span>{moment.unix(time).format('DD/MM')}</span>
      <h2>{Math.round(temp)}°</h2>
    </div>
  );
}

export default DayCard;
