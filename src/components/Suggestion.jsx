import React, { useState, useEffect } from 'react';
import fetchData from '../util/dataFromApi';


const geoapifyKey = process.env.REACT_APP_GEOAPIFY_KEY;

const Suggestion = ({ cityText, positionSuccess }) => {
  const [sugg, setSugg] = useState([]);

  useEffect(() => {
    if (cityText && cityText.length > 2) {
      fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${cityText}&format=json&apiKey=${geoapifyKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          // console.log('data 22 suggestion : ', data);
          setSugg(
            data.results.map((result) => ({
              city: result.address_line1,
              country: result.country,
              lat: result.lat,
              lon: result.lon,
            }))
          );
        })
        .catch((error) => console.log('error', error));
    }
  }, [cityText]);

  function handleSuggestionClick(item) {
    const coords = {
      latitude: item.lat,
      longitude: item.lon,
      city: item.city,
      country: item.country,
    };
    // console.log(' coords sugg : ', coords);
    positionSuccess({ coords });
  }
  return (
    <ul className='suggUl'>
      {sugg.map((item, index) => (
        <li key={index} onClick={() => handleSuggestionClick(item)}>
          {item.city} , {item.country}
        </li>
      ))}
    </ul>
  );
};

export default Suggestion;
