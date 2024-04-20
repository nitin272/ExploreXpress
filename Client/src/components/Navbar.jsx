import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompass, faBars, faHome, faUsers, faStar, faEnvelope,
  faCalendarAlt, faUserCircle, faSignOutAlt, faTimes
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [newNavBar, setNewNavBar] = useState(false);
  const [userName, setUserName] = useState(""); // State to store user's name
  const navigate = useNavigate();

  const isLoggedIn = () => localStorage.getItem('user') !== null;

  useEffect(() => {
    const fetchUserName = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const { userId, token } = user;

      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:4000/user/${userId}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});


        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        setUserName(data.name); // Assuming the response contains the user's name
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (isLoggedIn()) {
      fetchUserName();
    }
  }, []); // This effect runs once on mount

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    navigate('/login'); 
  };

  return (
    <header className="header">
      <h2 className='menu'>
        <FontAwesomeIcon
          icon={faBars} 
          onClick={() => setNewNavBar(!newNavBar)}
        />
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
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setNewNavBar(!newNavBar)}
          />
        </h3>
        <ul className="new-navbar-options">
          <li><Link to="/" style={{color: 'black'}}><FontAwesomeIcon icon={faHome} style={{ fontSize: '30px', color: 'grey' }}/> Home</Link></li>
          <li><Link to="/About"><FontAwesomeIcon icon={faUsers} style={{ fontSize: '30px', color: 'skyblue' }}/> About Us</Link></li>
          <li><FontAwesomeIcon icon={faStar} style={{ fontSize: '30px', color: 'yellow' }}/> Review</li>
          <li><FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '30px', color: 'green' }}/> Contact</li>
          <li><FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '30px', color: 'blue' }}/> My Plans</li>
          {isLoggedIn() ? (
            <>
              <li><Link to="/account" style={{color: 'purple'}}><FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '30px' }}/> My Account</Link></li>
              <li onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: '30px', color: 'red' }}/> Logout</li>
            </>
          ) : (
            <Link to="/login" className='Login'>Login</Link>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
