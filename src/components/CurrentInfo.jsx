import React from 'react';

const CurrentInfo = ({ title, data }) => {
  return (
    <div className='currentDetailsInfo'>
      <h4>{title}</h4>
      <p>{data}</p>
    </div>
  );
};

export default CurrentInfo;
