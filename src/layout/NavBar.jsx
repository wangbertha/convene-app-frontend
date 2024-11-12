import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { logout, selectToken } from "../services/authSlice";
import { useDispatch, useSelector } from "react-redux";
import "../styles/nav.css"

export default function Navbar() {
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log(token);

  function handleLogout() {
    dispatch(logout());
    navigate("/");
  }
  return (
    <nav className="navbar">
      <NavLink className="convene-nav-tab" to="/"><span className="underline-center-load">CONVENE</span></NavLink>
      <div className="nav-links">
        { token && <NavLink to="/profile"><span className="underline-center-load">Own Profile</span></NavLink> }
        { token && <NavLink to="/inbox"><span className="underline-center-load">Inbox</span></NavLink> }
        { token && <NavLink to="/browse"><span className="underline-center-load">Browse Profiles</span></NavLink> }
        <NavLink to="/events"><span className="underline-center-load">Events</span></NavLink>
        {token ? (
          <a href="#" onClick={handleLogout}>
            <span className="underline-center-load">
              Log Out
            </span>
          </a>
        ) : (
          <NavLink to="/login">
            <span className="underline-center-load">
              Login
            </span>
          </NavLink>
        )}
      </div>
    </nav>
  );
}