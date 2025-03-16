import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Profile from './components/Profile/Profile';
import MyPictures from './components/MyPictures/MyPictures';
import PictureDetails from './components/PictureDetails/PictureDetails';
import Messages from './components/Messages/Messages';

const App = () => {
  return (
    <div className="app-wrapper">
      <Router>
        <Navbar />
          <Routes>
              <Route path="/" element={<Profile />} />
              <Route path="/picture/:id" element={<PictureDetails />} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
