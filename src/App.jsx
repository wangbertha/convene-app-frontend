import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './src/layout/Navbar';
import Footer from './src/layout/Footer';
import LandingPage from './components/LandingPage';
import BrowseProfiles from './components/BrowseProfiles';
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
