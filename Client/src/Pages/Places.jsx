import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const FamousPlaces = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(response => {
        const allPlaces = response.data.reduce((acc, cityData) => {
          const cityPlaces = cityData.cities.reduce((cityAcc, city) => {
            return cityAcc.concat(city.places);
          }, []);
          return acc.concat(cityPlaces);
        }, []);
        setPlaces(allPlaces);
      })
      .catch(error => {
        console.error('There was an error fetching the places data:', error);
      });
  }, []);

  return (
    <>
    <Navbar />
    <div>
      <h2>Famous Places</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {places.map((place, index) => (
          <div key={index} style={{ width: '300px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', padding: '10px', borderRadius: '5px' }}>
            <img src={place.image1} alt={place.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
            <h3>{place.name}</h3>
            <p>{place.description}</p>
            <p>Address: {place.address}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default FamousPlaces;
