import React from 'react';  // eslint-disable-line
import PropTypes from 'prop-types';
import jadepotlogo from '../assets/jadepotlogo.png';

const Loading = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center h-screen bg-background1">
    <div className="flex flex-col items-center space-y-6 text-center">
      <img src={jadepotlogo} className="h-20 w-20 animate-bounce" alt="Loading icon" />
      <h5 className="text-2xl font-bold text-text1 animate-pulse">{message}</h5>
      <div className="w-32 h-1 bg-text1 rounded-full animate-pulse"></div>
    </div>
  </div>
);

Loading.propTypes = {
  message: PropTypes.string,
};

export default Loading;
