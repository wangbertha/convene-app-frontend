import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { logout, selectToken } from "../components/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar() {
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    navigate("/");
  }
  return (
    <nav className="navbar">
      <NavLink to="/">CONVENE</NavLink>
      <div className="nav-links">
        <Link to="/profile">Own Profile</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/browse">Browse Profiles</Link>
        <Link to="/events">Events</Link>
        <Link to="/about">About</Link>
        <Link to="/userprefs">User Prefs</Link>
        {token ? (
          <a href="#" onClick={handleLogout}>
            Log Out
          </a>
        ) : (
          <Link to="/login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
