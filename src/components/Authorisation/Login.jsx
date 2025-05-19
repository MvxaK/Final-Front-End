import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import s from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Entered');
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName?.split(' ')[0] || '',
          lastname: user.displayName?.split(' ')[1] || '',
          avatarUrl: user.photoURL || '',
          createdAt: new Date(),
        });
      }

      console.log('Logged in with Google');
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
      alert('Google login failed: ' + error.message);
    }
  };

  return (
    <div className={s.loginContainer}>
      <form onSubmit={handleLogin} className={s.loginForm}>
        <h2>Log In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Enter</button>
        <button type="button" onClick={() => navigate('/register')}>
          Create new account
        </button>
        <button type="button" onClick={handleGoogleLogin} className={s.googleButton}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className={s.googleIcon}
          />
          Enter with Google
        </button>
        <button type="button" onClick={() => navigate('/reset-password')}>
          Forget password?
        </button>
      </form>
    </div>
  );
};

export default Login;
