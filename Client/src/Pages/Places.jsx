import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Load'; 

const FamousPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();


  const apiurl = "https://explorexpress-n2ek.onrender.com";

  useEffect(() => {
    setLoading(true);
    axios.get(`${apiurl}/places`)
      .then(response => {
        setPlaces(response.data);
        setLoading(false); 
      })
      .catch(error => {
        console.error('There was an error fetching the places data:', error);
        setLoading(false); 
      });
  }, []);

  const handleMoreDetails = (id) => {
    navigate(`/place/${id}`); 
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 pt-16">
        <h2 className="text-2xl font-semibold my-4">Famous Places</h2>
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-wrap gap-5">
            {places.map((place) => (
              <div key={place._id} className="w-72 shadow-lg rounded-lg overflow-hidden">
                <img src={place.image1} alt={place.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-medium">{place.name},{place.city}</h3>
                  <button
                    onClick={() => handleMoreDetails(place._id)}
                    className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    More Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FamousPlaces;
