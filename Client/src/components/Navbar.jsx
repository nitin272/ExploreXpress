import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to import axios
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompass, faBars, faHome, faUsers, faStar, faEnvelope,
  faCalendarAlt, faUserCircle, faSignOutAlt, faTimes
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [newNavBar, setNewNavBar] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const isLoggedIn = () => localStorage.getItem('authType') !== null;

  useEffect(() => {
    const fetchUserName = async () => {
      const authType = localStorage.getItem('authType');
      if (!authType) {
        console.log('No auth type found, aborting fetch operation.');
        return;
      }
  
      if (authType === 'manual') {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const { userId, token } = user;
        if (!userId) {
          console.log('No userId found, aborting fetch operation.');
          return;
        }
        const url = `http://localhost:4000/user/${userId}`;
        try {
          const response = await axios.get(url, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('HTTP Response:', response);
          setUserName(response.data.name);
        } catch (error) {
          console.error('Error during fetch:', error);
        }
      } else if (authType === 'google') {
        try {
          const response = await axios.get('http://localhost:4000/login/sucess', { withCredentials: true });
          console.log('Google user response:', response);
          if (response.data && response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setUserName(response.data.user.displayName);
          } else {
            console.error('No user data found in the response.');
          }
        } catch (error) {
          console.error('Error fetching Google user data:', error);
        }
      }
    };
  
    if (isLoggedIn()) {
      fetchUserName();
    }
  }, []); // This effect runs once on mount
  
  const handleLogout = () => {
    console.log('Logging out, clearing local storage...');
  
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="header">
      <h2 className='menu'>
        <FontAwesomeIcon icon={faBars} onClick={() => setNewNavBar(!newNavBar)} />
      </h2>
      <h1 className="logo-text">
        <FontAwesomeIcon icon={faCompass} /> ExploreXpress
      </h1>
      
      <div className={newNavBar ? "new-navbar active" : "new-navbar"}>
        {isLoggedIn() && (
          <div className="user-info">
            <h4>Welcome, {userName}</h4> 
          </div>
        )}
        <h3 className='cross'>
          <FontAwesomeIcon icon={faTimes} onClick={() => setNewNavBar(!newNavBar)} />
        </h3>
        <ul className="new-navbar-options">
          <li><Link to="/" style={{ color: 'black' }}><FontAwesomeIcon icon={faHome} style={{ fontSize: '30px', color: 'grey' }}/> Home</Link></li>
          <li><Link to="/About"><FontAwesomeIcon icon={faUsers} style={{ fontSize: '30px', color: 'skyblue' }}/> About Us</Link></li>
          <li><FontAwesomeIcon icon={faStar} style={{ fontSize: '30px', color: 'yellow' }}/> Review</li>
          <li><FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '30px', color: 'green' }}/> Contact</li>
          <li><FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '30px', color: 'blue' }}/> My Plans</li>
          {isLoggedIn() ? (
            <>
              <li><Link to="/account" style={{ color: 'purple' }}><FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '30px' }}/> My Account</Link></li>
              <li onClick={handleLogout} style={{ cursor: 'pointer', color: 'red' }}>
                <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: '30px' }}/> Logout
              </li>
            </>
          ) : (
            <li><Link to="/login" className='Login'>Login</Link></li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
