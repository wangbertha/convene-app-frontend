import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { logout, selectToken } from "../components/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import "../styles/nav.css"

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
        <NavLink to="/profile">Own Profile</NavLink>
        <NavLink to="/chat">Chat</NavLink>
        <NavLink to="/browse">Browse Profiles</NavLink>
        <NavLink to="/events">Events</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/userprefs">User Prefs</NavLink>
        {token ? (
          <a href="#" onClick={handleLogout}>
            Log Out
          </a>
        ) : (
          <NavLink to="/login">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}