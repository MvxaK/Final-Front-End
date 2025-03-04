import React from 'react'
import './App.css';
import Header from './components/Header/Header';
import Navbar from './components/Navbar/Navbar';
import Profile from './components/Profile/Profile';
import Messages from './components/Messages/Messages';

const App = () => {
  return (
    <div className="app-wrapper">
      {/*<Header/>*/}
      <Navbar />
      <Profile />
    </div>
  );
}

export default App;
