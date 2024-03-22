import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Ensure this matches the path to your CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompass, faBars, faHome, faUsers, faStar, faEnvelope,
  faCalendarAlt, faUserCircle, faSignOutAlt, faTimes
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [newNavBar, setNewNavBar] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in by looking for user data in localStorage
  const isLoggedIn = () => localStorage.getItem('user') !== null;

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data from localStorage
    navigate('/login'); // Redirect to login page after logout
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
        <h3 className='cross'>
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setNewNavBar(!newNavBar)}
          />
        </h3>
        <ul className="new-navbar-options">
          <li><Link to="/" style={{color: 'black'}}><FontAwesomeIcon icon={faHome} style={{ fontSize: '30px', color: 'grey' }}/> Home</Link></li>
          <li><FontAwesomeIcon icon={faUsers} style={{ fontSize: '30px', color: 'skyblue' }}/> About Us</li>
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
