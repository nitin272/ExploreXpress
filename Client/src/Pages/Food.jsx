import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';


const UserContext = React.createContext();

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(response => {
        const allRestaurants = response.data.reduce((acc, cityData) => {
          const cityRestaurants = cityData.cities.reduce((cityAcc, city) => {
            return cityAcc.concat(city.restaurents);
          }, []);
          return acc.concat(cityRestaurants);
        }, []);
        setRestaurants(allRestaurants);
        setFilteredRestaurants(allRestaurants);
      })
      .catch(error => {
        console.error('There was an error fetching the restaurant data:', error);
      });
  }, []);

 
  useEffect(() => {
    const result = restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRestaurants(result);
  }, [searchQuery, restaurants]);

  const handleBookTable = (restaurantName) => {
    if (!isLoggedIn) {
      alert("Please log in to book tables.");
      return;
    }

    console.log(`Booking table at: ${restaurantName}`);
    alert(`Table booked at: ${restaurantName}!`);
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Navbar />
      <div>
        <h2>All Cities Restaurants</h2>
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '10px', marginBottom: '20px', width: '300px' }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {filteredRestaurants.map((restaurant, index) => (
            <div key={index} style={{ width: '300px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', padding: '10px', borderRadius: '5px' }}>
              <img src={restaurant.image1} alt={restaurant.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
              <h3>{restaurant.name}</h3>
              <p>Rating: {restaurant.Rating.trim()}</p>
              <p>Address: {restaurant.address}</p>
              <button onClick={() => handleBookTable(restaurant.name)}>Book Table</button>
            </div>
          ))}
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default Restaurants;
