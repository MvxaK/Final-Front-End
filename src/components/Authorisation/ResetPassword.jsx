import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import s from './Login.module.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Message with link to reset is send to email.');
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className={s.loginContainer}>
      <form onSubmit={handleReset} className={s.loginForm}>
        <h2>Reset password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send mail</button>
        <button type="button" onClick={() => navigate('/login')}>
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;