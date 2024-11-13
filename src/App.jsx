import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './layout/NavBar';
import Footer from './layout/Footer';
import HomePage from './layout/Home';
import BrowseProfile from './components/users/BrowseProfiles';
import Auth from './components/auth/Auth';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Navbar />
        <HomePage />
        <Footer />
      </>
    ),
  },
  {
    path: '/login',
    element: (
      <>
        <Navbar />
        <Auth />
        <Footer />
      </>
    ),
  },
  {
    path: '/browse',
    element: (
      <>
        <Navbar />
        <BrowseProfile />
        <Footer />
      </>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
