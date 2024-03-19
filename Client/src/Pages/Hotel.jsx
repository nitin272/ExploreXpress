import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Hotel = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(response => {
        const allHotels = response.data.reduce((acc, cityData) => {
          const cityHotels = cityData.cities.reduce((cityAcc, city) => {
            return cityAcc.concat(city.Hotels);
          }, []);
          return acc.concat(cityHotels);
        }, []);
        setHotels(allHotels);
        setFilteredHotels(allHotels); 
      })
      .catch(error => {
        console.error('There was an error fetching the city data:', error);
      });
  }, []);

  useEffect(() => {
  
    const result = hotels.filter(hotel =>
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredHotels(result);
  }, [searchQuery, hotels]);

  return (
    <>
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
            <div key={index} style={{ width: '300px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', padding: '10px', borderRadius: '5px' }}>
              <img src={hotel.image1} alt={hotel.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
              <h3>{hotel.name}</h3>
              <p>Rating: {hotel.Rating.trim()}</p>
              <p>Price: {hotel.Price}</p>
              <p>Address: {hotel.address}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Hotel;
