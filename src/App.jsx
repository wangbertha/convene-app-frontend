import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navBar';
import Footer from './components/footer';
import LandingPage from './pages/landingPage';
import LoginPage from './pages/LoginPage';
import BrowseProfiles from './pages/BrowseProfiles';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/browse" element={<BrowseProfiles />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

