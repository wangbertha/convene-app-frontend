import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/home.css";


export default function Home() {
    const navigate = useNavigate();
    const [fadeOut, setFadeOut] = useState(false);

    const handleClick = () => {
        setFadeOut(true);
        setTimeout(() => navigate('/login'), 300);
    };
    
    return (
        <div className="landing-page">
            <div className={`logo-popup ${fadeOut ? 'fade-out' : ''}`} onClick={handleClick}>
                <img src="/popcorn_pals_convene.png" alt="Convene Logo" className="logo" />
            </div>
        </div>
    );
}