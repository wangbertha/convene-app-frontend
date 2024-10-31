import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/global.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  const handleClick = () => {
    setFadeOut(true);
    setTimeout(() => navigate('/login'), 300);
  };

  return (
    <div className="landing-page">
      <div className={`logo-popup ${fadeOut ? 'fade-out' : ''}`} onClick={handleClick}>
        <img src={logo} alt="Convene Logo" className="logo" />
      </div>
    </div>
  );
}
