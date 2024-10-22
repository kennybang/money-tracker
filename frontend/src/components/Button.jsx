import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = ({ text, onClick, to }) => {
  if (to) {
    return (
      <Link to={to}>
        <button className="custom-button">
          {text}
        </button>
      </Link>
    );
  }

  return (
    <button className="custom-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
