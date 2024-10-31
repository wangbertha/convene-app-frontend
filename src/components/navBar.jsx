import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">CONVENE</Link>
      <div className="nav-links">
        <Link to="/profile">Own Profile</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/browse">Browse Profiles</Link>
        <Link to="/events">Events</Link>
        <Link to="/about">About</Link>
        <Link to="/userprefs">User Prefs</Link>
      </div>
    </nav>
  );
}
