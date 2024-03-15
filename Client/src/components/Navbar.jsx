import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCompass, faBars, faHome, faUsers, faStar, faEnvelope,
  faCalendarAlt, faUserCircle, faSignOutAlt, faTimes
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [newNavBar, setNewNavBar] = useState(false);

  const toggleNavbar = () => {
    setNewNavBar(!newNavBar);
  };

  return (
    <header className="header">
      <h2 className='menu'>
      <FontAwesomeIcon
        icon={faBars} 
        onClick={toggleNavbar}
      />
      </h2>
      <h1 className="logo-text">
        <FontAwesomeIcon icon={faCompass} /> ExploreXpress
      </h1>
      
      <div className={newNavBar ? "new-navbar active" : "new-navbar"}>
        <h3 className='cross'>
        <FontAwesomeIcon
          icon={faTimes}
          style={{ }}
          onClick={toggleNavbar}
        /></h3>
        <ul className="new-navbar-options">
          <li><Link to="/" style={{color: 'black'}}><FontAwesomeIcon icon={faHome} style={{ fontSize: '30px', color: 'grey' }}/> Home</Link></li>
          <li><FontAwesomeIcon icon={faUsers} style={{ fontSize: '30px', color: 'skyblue' }}/> About Us</li>
          <li><FontAwesomeIcon icon={faStar} style={{ fontSize: '30px', color: 'yellow' }}/> Review</li>
          <li><FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '30px', color: 'green' }}/> Contact</li>
          <li><FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '30px', color: 'blue' }}/> My Plans</li>
          <li><FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '30px', color: 'purple' }}/> My Account</li>
          <li><FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: '30px', color: 'red' }}/> Logout</li>

          <Link to="/login" className='Login'>Login</Link>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
