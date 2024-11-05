import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layout/NavBar'; 
import Footer from './layout/Footer';
import LandingPage from './components/LandingPage';
import BrowseProfiles from './components/BrowseProfile';
import Auth from './components/auth/Auth';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/browse" element={<BrowseProfiles />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
