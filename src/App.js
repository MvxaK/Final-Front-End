import React from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Profile from './components/Profile/Profile';
import PictureDetails from './components/PictureDetails/PictureDetails';

const App = () => {
  return (
    <div className="app-wrapper">
      <Navbar />
      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/picture/:id" element={<PictureDetails />} />
      </Routes>
    </div>
  );
}

export default App;
