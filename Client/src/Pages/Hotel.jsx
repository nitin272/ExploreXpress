import React, { useEffect, useState, createContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';  
import Footer from '../components/Footer';
import Loading from '../components/Load'; // Make sure this is the correct import path
const UserContext = createContext();


const apiurl = import.meta.env.VITE_APP_API_URL;

const Hotel = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

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
    setLoading(true); // Start loading
    axios.get(`${apiurl}/hotels`)
      .then(response => {
        setHotels(response.data);
        setLoading(false); // Stop loading once data is fetched
      })
      .catch(error => {
        console.error('There was an error fetching the hotels data:', error);
        alert('Failed to fetch hotels. Please try again later.');
        setLoading(false); // Stop loading on error
      });
  }, []);

  const handleBookHotel = (hotelId) => {
    if (!isLoggedIn) {
      alert("Please log in to book hotels.");
      return;
    }
    navigate(`/hotel/${hotelId}`);
  };

  const filteredHotels = searchQuery
    ? hotels.filter(hotel => hotel.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : hotels;

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Navbar />
      <div className="container mx-auto px-4 pt-16">
        <h2 className="text-2xl font-semibold my-4">All Cities Hotels</h2>
        <input
          aria-label="Search hotels"
          type="text"
          placeholder="Search hotels..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 mb-5 w-full md:w-1/3 border rounded shadow"
        />
        {loading ? <Loading /> : (
          <div className="flex flex-wrap gap-5">
            {filteredHotels.map((hotel) => (
              <div key={hotel._id} className="w-full md:w-1/3 lg:w-1/4 p-4 border shadow-lg rounded-lg">
                <img src={hotel.image1} alt={hotel.name} className="w-full h-48 object-cover rounded-lg" />
                <h3 className="text-lg font-medium my-2">{hotel.name}</h3>
                <p className="text-sm">Rating: {hotel.Rating}</p>
                <p className="text-sm">Price: {hotel.Price} per night</p>
                <p className="text-sm">Address: {hotel.address}</p>
                <button
                  aria-label={`Book ${hotel.name}`}
                  className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleBookHotel(hotel._id)}>
                  Book Now
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

export default Hotel;
