import React from 'react';
import DayCard from './DayCard';

const DaysWeather = ({ data }) => {
  const { time, temp, weathercode } = data.dailyData;

  return (
    <div className='DaysContainer'>
      {time.map((_, index) => {
        return (
          <DayCard
            index={index}
            time={time[index]}
            temp={temp[index]}
            weathercode={weathercode[index]}
          />
        );
      })}
    </div>
  );
};

export default DaysWeather;
