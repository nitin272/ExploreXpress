import React, { useState } from 'react';
import './Form.css';
import { Link, Route , useNavigate} from 'react-router-dom'; // Corrected 'Link' import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const AuthForm = () => {
  const [isActive, setIsActive] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    navigate('/Home');

    
    event.preventDefault();

    if (isActive) {
      console.log('Registration Form Data:', { email, password, name });
    } else {
      console.log('Login Form Data:', { email, password });
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Sign in with Google');
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
          <p>Or Sign up with</p>
          <div className="social-login">
            <button type="button" className="google" onClick={handleGoogleSignIn}>
            <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="" srcset="" />Continue with Google
            </button>
          </div>
          <p>Already have an account? <button type="button" onClick={() => setIsActive(false)}>Login</button></p>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="form-container sign-in">
          <h1>Sign In</h1>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Sign In</button>
          <p>Or Login with</p>
          <div className="social-login">
          <button type="button" className="google" onClick={handleGoogleSignIn}>
            <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="" srcset="" />Continue with Google
            </button>
          </div>
          <p>Don't have an account? <button type="button" onClick={() => setIsActive(true)}>Sign Up</button></p>
        </form>
      )}
    </div>
  );
};

export default AuthForm;
