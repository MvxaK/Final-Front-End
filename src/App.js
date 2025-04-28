import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Profile from './components/Profile/Profile';
import Users from './components/Users/Users';
import PictureDetails from './components/PictureDetails/PictureDetails';
import AllPictures from './components/AllPictures/AllPictures';
import { ImagesProvider } from "./context/ImagesContext";
import ProtectedRoute from './ProtectedRoute';
import Register from './components/Authorisation/Register';
import Login from './components/Authorisation/Login';

const App = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  return (
    <ImagesProvider>
      <div className="app-wrapper">
        {!hideNavbar && <Navbar />}
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/picture/:id" 
            element={
              <ProtectedRoute>
                <PictureDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/main" 
            element={
              <ProtectedRoute>
                <AllPictures />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </ImagesProvider>
  );
}

export default App;
