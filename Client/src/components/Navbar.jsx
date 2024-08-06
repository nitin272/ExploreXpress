import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import {
  faCompass, faBars, faHome, faUsers, faStar, faEnvelope,
  faCalendarAlt, faUserCircle, faSignOutAlt, faTimes
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [newNavBar, setNewNavBar] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const apiurl = import.meta.env.VITE_APP_API_URL;
  
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
        const url = `${apiurl}/user/${userId}`;
        try {
          const response = await axios.get(url, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          setUserName(response.data.name);
        } catch (error) {
          console.error('Error during fetch:', error);
        }
      } else if (authType === 'google') {
        try {
          const response = await axios.get(`${apiurl}/login/success`, { withCredentials: true });
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
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

return (
  <header className="fixed top-0 left-0 w-full flex items-center justify-between px-5 py-3 bg-white shadow-lg z-50">
    <h2 className='text-4xl cursor-pointer'>
      <FontAwesomeIcon icon={faBars} onClick={() => setNewNavBar(!newNavBar)} />
    </h2>
    <h1 className="text-3xl font-bold flex items-center text-blue-700 gap-2 hover:scale-105 hover:-rotate-3 transition-transform duration-300">
      <FontAwesomeIcon icon={faCompass} /> ExploreXpress
    </h1>

    <div className={`${newNavBar ? "translate-x-0 ease-out" : "-translate-x-full ease-in"} fixed top-0 left-0 w-2/3 max-w-sm h-full bg-blue-200 backdrop-blur-lg transition-transform duration-500 z-20 pt-20 shadow-xl`}>
      {isLoggedIn() && (
        <div className="bg-gradient-to-r from-blue-200 to-blue-300 bg-opacity-60 text-gray-900 py-5 border-b-8 border-blue-400 text-center shadow-lg transform transition duration-500 hover:scale-105 hover:bg-opacity-80">
        <h4 className="text-2xl font-semibold animate-pulse">Welcome, {userName}</h4>
    </div>
    
      )}
      <h3 className='text-6xl text-red-600 absolute top-4 right-4 cursor-pointer hover:rotate-90 transition duration-300'>
        <FontAwesomeIcon icon={faTimes} onClick={() => setNewNavBar(!newNavBar)} />
      </h3>
      <ul className="list-none p-0 m-0 text-gray-900">
        <li className="px-6 py-4 text-xl flex items-center gap-3 border-b border-gray-400 hover:bg-blue-700 hover:text-white cursor-pointer transition-all duration-300">
          <Link to="/" className="flex items-center gap-2">
            <FontAwesomeIcon icon={faHome} className="text-3xl text-gray-500"/> Home
          </Link>
        </li>
        <li className="px-6 py-4 text-xl flex items-center gap-3 border-b border-gray-400 hover:bg-blue-600 hover:text-white cursor-pointer transition-all duration-300">
          <Link to="/About" className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUsers} className="text-3xl text-sky-500"/> About Us
          </Link>
        </li>

        <li className="px-6 py-4 text-xl flex items-center gap-3 border-b border-gray-400 hover:bg-green-600 hover:text-white cursor-pointer transition-all duration-300">
          <FontAwesomeIcon icon={faEnvelope} className="text-3xl text-green-600"/> Contact
        </li>
        <li className="px-6 py-4 text-xl flex items-center gap-3 border-b border-gray-400 hover:bg-blue-500 hover:text-white cursor-pointer transition-all duration-300">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-3xl text-blue-500"/> My Plans
        </li>
        {isLoggedIn() ? (
          <>
            <li className="px-6 py-4 text-xl flex items-center gap-3 border-b border-gray-400 hover:bg-purple-600 hover:text-white cursor-pointer transition-all duration-300">
              <Link to="/account" className="flex items-center gap-2">
                <FontAwesomeIcon icon={faUserCircle} className="text-3xl"/> My Account
              </Link>
            </li>
            <li className="px-6 py-4 text-xl flex items-center gap-3 border-b border-gray-400 hover:bg-red-600 hover:text-white cursor-pointer transition-all duration-300" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="text-3xl text-red-600"/> Logout
            </li>
          </>
        ) : (
          <li className="px-6 py-4 text-xl flex items-center gap-3 border-b border-gray-400 hover:bg-blue-600 hover:text-white cursor-pointer transition-all duration-300">
            <Link to="/login" className="block w-full">
              <div className='block w-auto px-6 py-3 text-lg m-auto text-gray-800 bg-blue-700 rounded-md font-medium cursor-pointer hover:bg-blue-800 transition-colors duration-300'>Login</div>
            </Link>
          </li>
        )}
      </ul>
    </div>
  </header>
);

};

export default Navbar;
