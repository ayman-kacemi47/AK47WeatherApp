import { useEffect, useState } from 'react';
import './App.css';
import Current from './components/Current';
import DaysWeather from './components/DaysWeather';
import TimeWeather from './components/TimeWeather';
import Footer from './components/Footer';
import notFound from './SVGs/pageNotFound.png';
import fetchData from './util/dataFromApi.js';
import searchLogo from './SVGs/search-svgrepo-com.svg';
import checkNight from './util/checkNight';
import Suggestion from './components/Suggestion';

function App() {
  const [city, setCity] = useState('');
  const [cityV2, setCityV2] = useState(''); //so the city don't change when start typing
  const [country, setCountry] = useState('');
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [Moon, setMoon] = useState(false);
  const [zoneTime, setZoneTime] = useState();
  const [Coords, setCoords] = useState();

  const [isActive, setIsActive] = useState(false);

  const year = new Date();
  //get locations using :

  async function positionSuccess({ coords }) {
    setCoords(coords);
    //console.log('cords ', coords);
    let data, city2, country2;
    if (coords.city && coords.country) {
      data = {
        lat: coords.latitude,
        long: coords.longitude,
        city: coords.city,
        country: coords.country,
      };
      city2 = data.city;
      country2 = data.country;
    } else {
      data = { lat: coords.latitude, long: coords.longitude };
    }
    setLoading(true);
    const res = await fetchData(data);
    if (res === 'cityNotFound') {
      setLoading(false);
      setData(null);
      setMsg(
        <div className='notFound'>
          <h1>Ville non Trouvé !!</h1>
          <img src={notFound} alt='not found Sad Sun' />
        </div>
      );
    } else {
      setData(res);
      setCity(city2);
      setCityV2(city2);
      setCountry(country2);

      //console.log(' city : ', res);

      setLoading(false);
    }
  }
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(positionSuccess, positionError);

    function positionError(error) {
      console.error('Error getting location: ', error);
    }
  }, []);

  //In this code, I’ve added a new state variable loading. When you start fetching data, you set loading to true. After the data has been fetched and state has been updated, you set loading to false. In your render method, you check if loading is true. If it is, you display a loading message. If not, you render your Current and DaysWeather components. This ensures that your components are only rendered when the data they depend on is available.

  async function handleSubmit(e) {
    e.preventDefault(); // prevent auto submition
    // console.log('city:  ', city);
    setLoading(true);
    const res = await fetchData(city);
    if (res === 'cityNotFound') {
      setLoading(false);
      setData(null);
      setMsg(
        <div className='notFound'>
          <h1>Ville non Trouvée !!</h1>
          <img src={notFound} alt='not found Sad Sun' />
        </div>
      );
    } else {
      setCity(res.city);
      setCityV2(res.city);
      setCountry(res.country);
      setData(res);
      setLoading(false);
    }
  }

  let sunR, sunS;

  const intervalId = setInterval(() => {
    sunR = document.querySelector('.sunrise');
    sunS = document.querySelector('.sunset');

    if (sunR && sunS) {
      const sunRPosition = sunR.getBoundingClientRect();
      const sunSPosition = sunS.getBoundingClientRect();

      const distance = sunSPosition.left - sunRPosition.right;

      const style = document.createElement('style');
      style.innerHTML = `
        .sunrise::after {
          width: ${distance}px;
        }
      `;
      document.head.appendChild(style);

      // Clear the interval once the elements are found and the width is set
      clearInterval(intervalId);
      if (data) {
        const res = checkNight(data);
        setZoneTime(res.currentTime);
        setMoon(res.bool);
      }
    }
  }, 100); // Check every 100ms

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsActive(false);
    }, 200); // Adjust the delay as needed
  };

  return (
    <div className='App'>
      <div className='search'>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <span className='span'>
            <input
              type='text'
              placeholder='nom du ville, city name'
              id='cityInput'
              required
              autoComplete='off'
              onChange={(e) => {
                setCity(e.target.value);
              }}
              onFocus={() => setIsActive(true)}
              onBlur={handleInputBlur}
            />
            <button type='submit' style={{ position: 'relative' }}>
              <img
                src={searchLogo}
                alt='search svg'
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%,-50%) ',
                  width: '20px',
                }}
              />
            </button>
          </span>
          {city && city.length > 2 && isActive ? (
            <Suggestion cityText={city} positionSuccess={positionSuccess} />
          ) : (
            ''
          )}
        </form>
        <div>
          {data && (
            <h1 className='cityAndCountry'>
              {data.city ? data.city : cityV2} {data.country}
            </h1>
          )}
        </div>
      </div>

      {loading ? (
        <div className='loaderContainer'>
          <div className='loader'></div>
        </div>
      ) : data ? (
        <>
          {' '}
          <header>
            <Current data={data} moon={Moon} />
            <DaysWeather data={data} />
          </header>
          <div>
            <TimeWeather data={data} moon={Moon} zoneTime={zoneTime} />
          </div>
        </>
      ) : msg ? (
        msg
      ) : (
        ''
      )}

      <Footer />
    </div>
  );
}

export default App;
