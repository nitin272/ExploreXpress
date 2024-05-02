import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const FamousPlaces = () => {
  const [places, setPlaces] = useState([]);
  const apiurl = "http://localhost:4000"
  useEffect(() => {
    axios.get(`${apiurl}/places`) 
      .then(response => {
        setPlaces(response.data);
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
            <div key={place._id} style={{ width: '300px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', padding: '10px', borderRadius: '5px' }}>
              <img src={place.image1} alt={place.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />
              <h3>{place.name}</h3>
              {/* <p>{place.description}</p> */}
              {/* <p>Address: {place.address}</p>
              <p>Timing: {place.Timing}</p> */}
              {/* <p>Cost: {place.Cost}</p> */}
              {/* <a href={place.Link} target="_blank" rel="noopener noreferrer">Learn More</a> */}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FamousPlaces;
