import React, { useEffect, useState, createContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const UserContext = createContext();

const Hotel = () => {
  const [hotels, setHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 


  useEffect(() => {
    axios.get('http://localhost:4000/hotels') 
      .then(response => {
        setHotels(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the hotels data:', error);
      });
  }, []);

 
  const filteredHotels = searchQuery.length > 0
    ? hotels.filter(hotel =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.address.toLowerCase().includes(searchQuery.toLowerCase()))
    : hotels;

  const handleBookHotel = (hotelId) => {
    if (!isLoggedIn) {
      alert("Please log in to book hotels.");
      return;
    }
  
    axios.get(`http://localhost:4500/hotel/${hotelId}`)
      .then(response => {
        console.log('Hotel data:', response.data);
        alert(`Booked hotel with ID: ${hotelId}! Name: ${response.data.name}`);
      })
      .catch(error => {
        console.error('There was an error booking the hotel:', error);
        alert('Failed to book the hotel.');
      });
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Navbar />
      <div>
        <h2>All Cities Hotels</h2>
        <input
          type="text"
          placeholder="Search hotels..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '10px', marginBottom: '20px', width: '300px' }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {filteredHotels.map((hotel, index) => (
            <div key={hotel._id} style={{ width: '300px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', padding: '10px', borderRadius: '5px' }}>
              <img src={hotel.image1} alt={hotel.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
              <h3>{hotel.name}</h3>
              <p>Rating: {hotel.Rating}</p>
              <p>Price: {hotel.Price}</p>
              <p>Address: {hotel.address}</p>
              <button onClick={() => handleBookHotel(hotel._id)}>Book Now</button>
            </div>
          ))}
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default Hotel;
