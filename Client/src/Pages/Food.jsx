import React, { useEffect, useState, createContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Load';  // Import your Loading component

const UserContext = createContext();


const apiurl = "https://explorexpress-n2ek.onrender.com";

const Restaurant = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);  // State to handle loading

  useEffect(() => {
    const checkLoginStatus = () => {
      const authType = localStorage.getItem('authType');
      setIsLoggedIn(!!authType);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  useEffect(() => {
    setLoading(true);  // Start loading
    axios.get(`${apiurl}/restaurants`)
      .then(response => {
        setRestaurants(response.data);
        setLoading(false);  // Stop loading when the data is received
      })
      .catch(error => {
        console.error('There was an error fetching the restaurants data:', error);
        alert('Failed to fetch restaurants. Please try again later.');
        setLoading(false);  // Stop loading on error
      });
  }, []);

  const handleBookTable = (restaurantId) => {
    if (!isLoggedIn) {
      alert("Please log in to book tables.");
      return;
    }
    navigate(`/restaurant/${restaurantId}`);
  };

  const filteredRestaurants = searchQuery
    ? restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : restaurants;

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Navbar />
      <div className="container mx-auto px-4 pt-16">
        <h2 className="text-2xl font-semibold my-4">All Cities Restaurants</h2>
        <input
          aria-label="Search restaurants"
          type="text"
          placeholder="Search restaurants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 mb-5 w-full md:w-1/3 border rounded shadow"
        />
        {loading ? <Loading /> : (
          <div className="flex flex-wrap gap-5">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant._id} className="w-full md:w-1/3 lg:w-1/4 p-4 border shadow-lg rounded-lg">
                <img src={restaurant.image1} alt={restaurant.name} className="w-full h-48 object-cover rounded-lg" />
                <h3 className="text-lg font-medium my-2">{restaurant.name}</h3>
                <p className="text-sm">Rating: {restaurant.Rating}</p>
                <p className="text-sm">Address: {restaurant.address}</p>
                <button
                  aria-label={`Book at ${restaurant.name}`}
                  className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleBookTable(restaurant._id)}>
                  Book Table
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </UserContext.Provider>
  );
};

export default Restaurant;
