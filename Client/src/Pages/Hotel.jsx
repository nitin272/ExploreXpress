import React, { useEffect, useState, createContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';  
import Footer from '../components/Footer';

const UserContext = createContext();
const apiurl = "http://localhost:4000";

const Hotel = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState(null);

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
    axios.get(`${apiurl}/hotels`)
      .then(response => setHotels(response.data))
      .catch(error => {
        console.error('There was an error fetching the hotels data:', error);
        alert('Failed to fetch hotels. Please try again later.');
      });
  }, []);

  const handleBookHotel = (hotelId) => {
    if (!isLoggedIn) {
      alert("Please log in to book hotels.");
      return;
    }
    navigate(`/hotel/${hotelId}`);
  };

  const addToPlan = () => {
    axios.post(`${apiurl}/user/addToPlan`, { hotelId: selectedHotelId })
      .then(response => {
        console.log('Added to plan:', response);
        setShowConfirmationModal(false);
      })
      .catch(error => {
        console.error('Failed to add to plan:', error);
      });
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
      </div>
      <Footer />
    </UserContext.Provider>
  );
};

export default Hotel;
