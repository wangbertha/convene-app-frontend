import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './src/components/Navbar';
import Footer from './src/components/Footer';
import LandingPage from './pages/LandingPage';
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
