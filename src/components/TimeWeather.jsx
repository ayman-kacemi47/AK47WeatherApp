import React from 'react';
import moment from 'moment';
import TimeElement from './TimeElement';
import checkNight from '../util/checkNight';

const TimeWeather = ({ data, moon, zoneTime }) => {
  const { precip, temp, weathercode, windSpeed, tempFL, time } =
    data.hourlyData;

  const currentTime = moment().unix();
  const res = checkNight(data);
  return (
    <div className='realTimeCont'>
      {temp.map((_, index) => {
        if (time[index] < currentTime) {
          return null;
        } else {
          return (
            <TimeElement
              checkNight={res}
              precip={precip[index]}
              temp={temp[index]}
              weathercode={weathercode[index]}
              windSpeed={windSpeed[index]}
              tempFL={tempFL[index]}
              time={time[index]}
              moon={moon}
              zoneTime={zoneTime}
            />
          );
        }
      })}
    </div>
  );
};

export default TimeWeather;
