import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Profile from './components/Profile/Profile';
import AllUsers from './components/Users/Users';
import AboutUs from './components/AboutUs/AboutUs';
import PictureDetails from './components/PictureDetails/PictureDetails';
import AllPictures from './components/AllPictures/AllPictures';
import ProtectedRoute from './ProtectedRoute';
import Register from './components/Authorisation/Register';
import Login from './components/Authorisation/Login';
import RedirectAuthUser from './components/Authorisation/RedirectAuthUser';
import ResetPassword from './components/Authorisation/ResetPassword';
import { ImagesProvider } from "./context/ImagesContext";
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <ImagesProvider>
        <div className="app-wrapper">
          <Navbar />
          <Routes>
            <Route 
              path="/profile/:userId" 
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
                  <AllUsers />
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
              path="/" 
              element={
                <ProtectedRoute>
                  <AllPictures />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/about" 
              element={
                  <AboutUs />
              } 
            />
            <Route
              path="/login"
              element={
                <RedirectAuthUser>
                  <Login />
                </RedirectAuthUser>
              }
            />
            <Route
              path="/register"
              element={
                <RedirectAuthUser>
                  <Register />
                </RedirectAuthUser>
              }
            />
            <Route
              path="/reset-password"
              element={
                <RedirectAuthUser>
                  <ResetPassword />
                </RedirectAuthUser>
              }
            />
          </Routes>
        </div>
      </ImagesProvider>
    </ThemeProvider>
  );
}

export default App;
