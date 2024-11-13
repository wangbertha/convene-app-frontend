import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

export default function HomePage() {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>CONVENE</h1>
        <nav className="homepage-nav">
          <Link to="/login">login/register</Link> | 
          <Link to="/profile">own profile</Link> | 
          <Link to="/chat">chat</Link> | 
          <Link to="/browse">browse profiles</Link> | 
          <Link to="/events">events (view/edit)</Link> | 
          <Link to="/about">about (demo)</Link> | 
          <Link to="/prefs">user prefs</Link>
        </nav>
      </header>

      <main className="homepage-main">
        <h2>Hi, welcome to CONVENE</h2>
        <p>
          Please click here to <Link to="/login">login</Link> or <Link to="/register">register</Link>
        </p>
        <p>
          <Link to="/events">Click to view all events</Link>
        </p>
      </main>

      <footer className="homepage-footer">
        <p>
          <Link to="/contact">developer contact info</Link> | 
          <Link to="/privacy">privacy policy</Link> | 
          <Link to="/team">meet the team</Link> | 
          <Link to="/socials">find us on socials</Link> | 
          <Link to="/faq">FAQ</Link>
        </p>
      </footer>
    </div>
  );
}
