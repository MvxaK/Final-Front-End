import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const RedirectAuthUser = ({ children }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        navigate('/');
      } else {
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  if (checkingAuth) return null;

  return !isAuthenticated ? children : null;
};

export default RedirectAuthUser;
