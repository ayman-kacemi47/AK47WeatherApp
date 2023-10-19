import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className='footer'>
      <span>Kacemi Ayman WeatherApp </span>
      <span>
        Powered By <a href='https://open-meteo.com/'>open-meteo</a>
      </span>
      <span>©{year}</span>
    </footer>
  );
};

export default Footer;
