import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Form.css';

const AuthForm = () => {
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const apiUrl = "http://localhost:5000";

  

  const handleAuth = async (isSignUp, userData) => {
    try {
      const endpoint = isSignUp ? `${apiUrl}/auth/signup` : `${apiUrl}/auth/login`;
      const response = await axios.post(endpoint, userData);
      const { token, userId, email, imageUrl } = response.data;
      localStorage.setItem('user', JSON.stringify({ token, userId, email, imageUrl, name: name || email }));
      navigate('/');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data.message : error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = isActive ? { name, email, password } : { email, password };
    handleAuth(isActive, userData);
  };

  const handleGoogleSignIn = () => {
    window.location.href = `http://localhost:400/auth/google/callback`;
  };
  

  return (
    <div className={`container ${isActive ? 'active' : ''}`} id="container">
      {isActive ? (
        <form onSubmit={handleSubmit} className="form-container sign-up">
          <h1>Sign Up</h1>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Sign Up</button>
          <div className="social-login">
            <button type="button" className="google" onClick={handleGoogleSignIn}>Continue with Google</button>
          </div>
          <p>Already have an account? <button type="button" onClick={() => setIsActive(false)}>Login</button></p>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="form-container sign-in">
          <h1>Sign In</h1>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Sign In</button>
          <div className="social-login">
            <button type="button" className="google" onClick={handleGoogleSignIn}>Continue with Google</button>
          </div>
          <p>Don't have an account? <button type="button" onClick={() => setIsActive(true)}>Sign Up</button></p>
        </form>
      )}
    </div>
  );
};

export default AuthForm;
