import React, { useEffect, useState, createContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Load'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserContext = createContext();

const apiurl = import.meta.env.VITE_APP_API_URL;

const FullStackHotelApp = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editHotelId, setEditHotelId] = useState(null);
  const [showAddHotelForm, setShowAddHotelForm] = useState(false);

  const [newHotel, setNewHotel] = useState({
    name: '',
    rating: '',
    price: '',
    address: '',
    images: []
  });

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
    setLoading(true);
    axios.get(`${apiurl}/hotels`)
      .then(response => {
        setHotels(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the hotels data:', error);
        toast.error('Failed to fetch hotels. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleBookHotel = (hotelId) => {
    if (!isLoggedIn) {
      toast.info('Please log in to book hotels.');
      return;
    }
    navigate(`/hotel/${hotelId}`);
  };

  const handleEditHotel = (hotelId) => {
    const hotelToEdit = hotels.find(hotel => hotel._id === hotelId);
    if (hotelToEdit) {
      setEditMode(true);
      setEditHotelId(hotelId);
      setNewHotel({
        name: hotelToEdit.name,
        rating: hotelToEdit.rating,
        price: hotelToEdit.price,
        address: hotelToEdit.address,
        images: hotelToEdit.imageUrls || [] 
      });
      setShowAddHotelForm(true); 
    } else {
      console.error('Hotel not found for editing');
      toast.error('Hotel not found for editing. Please try again.');
    }
  };

  const handleDeleteHotel = (hotelId) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      axios.delete(`${apiurl}/hotels/${hotelId}`)
        .then(response => {
          console.log('Hotel deleted successfully:', response.data);
          const updatedHotels = hotels.filter(hotel => hotel._id !== hotelId);
          setHotels(updatedHotels);
          toast.success('Hotel deleted successfully.');
        })
        .catch(error => {
          console.error('Error deleting hotel:', error);
          toast.error('Failed to delete hotel. Please try again.');
        });
    }
  };

  const filteredHotels = searchQuery
    ? hotels.filter(hotel => hotel.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : hotels;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHotel({
      ...newHotel,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (newHotel.images.length + files.length > 5) {
      toast.error('You can upload a maximum of 5 images.');
      return;
    }

    setNewHotel({
      ...newHotel,
      images: [...newHotel.images, ...files.slice(0, 5 - newHotel.images.length)]
    });
  };

  const handleDeleteImage = async (index) => {
    const updatedImages = [...newHotel.images];
    updatedImages.splice(index, 1);
  
    try {

      const deleteImageUrls = [newHotel.images[index]]; 
  
      if (editMode) {

        const response = await axios.put(`${apiurl}/hotels/${editHotelId}`, { imageUrls: deleteImageUrls });
        console.log('Image deleted successfully:', response.data);
      } else {

        toast.success('Image deleted successfully.');
      }
  

      setNewHotel({
        ...newHotel,
        images: updatedImages
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image. Please try again.');
    }
  };
  
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newHotel.name);
    formData.append('rating', newHotel.rating);
    formData.append('price', newHotel.price);
    formData.append('address', newHotel.address);


    newHotel.images.forEach(file => {
      formData.append('images', file); 
    });

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    if (editMode) {
      axios.put(`${apiurl}/hotels/${editHotelId}`, formData, config)
        .then(response => {
          console.log('Hotel updated successfully:', response.data);
          toast.success('Hotel updated successfully.');

          setEditMode(false);
          setEditHotelId(null);
          setNewHotel({ name: '', rating: '', price: '', address: '', images: [] });
        })
        .catch(error => {
          console.error('Error updating hotel:', error);
          toast.error('Failed to update hotel. Please try again.');
        });
    } else {
      axios.post(`${apiurl}/hotels`, formData, config)
        .then(response => {
          console.log('New hotel added successfully:', response.data);
          toast.success('New hotel added successfully.');

          setShowAddHotelForm(false);
          setNewHotel({ name: '', rating: '', price: '', address: '', images: [] });
        })
        .catch(error => {
          console.error('Error adding new hotel:', error);
          toast.error('Failed to add new hotel. Please try again.');
        });
    }
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Navbar />
      <div className="container mx-auto px-4 pt-16">
        <h2 className="text-2xl font-semibold my-4">All Cities Hotels</h2>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => {
            setShowAddHotelForm(!showAddHotelForm);
            setEditMode(false); 
            setEditHotelId(null);
            setNewHotel({ name: '', rating: '', price: '', address: '', images: [] });
          }}
        >
          {showAddHotelForm ? "Cancel Add Hotel" : "Add New Hotel"}
        </button>
        {showAddHotelForm && (
          <div className="mb-5">
            <h3 className="text-xl font-semibold mb-2">{editMode ? 'Edit Hotel' : 'Add New Hotel'}</h3>
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Hotel Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newHotel.name}
                  onChange={handleInputChange}
                  required
                  className="p-2 w-full border rounded shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={newHotel.rating}
                  onChange={handleInputChange}
                  required
                  className="p-2 w-full border rounded shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price per night</label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={newHotel.price}
                  onChange={handleInputChange}
                  required
                  className="p-2 w-full border rounded shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={newHotel.address}
                  onChange={handleInputChange}
                  required
                  className="p-2 w-full border rounded shadow-sm"
                />
              </div>
              {newHotel.images.length > 0 && (
                <div className="mb-4">
                  {newHotel.images.map((file, index) => (
                    <div key={index} className="relative inline-block mr-2 mb-2">
                      <img
                        src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="h-20 w-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                        onClick={() => handleDeleteImage(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="mb-4">
                <label htmlFor="images" className="block text-sm font-medium text-gray-700">Upload Images (up to 5)</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="p-2 w-full border rounded shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {editMode ? 'Update Hotel' : 'Add Hotel'}
              </button>
            </form>
          </div>
        )}
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredHotels.map(hotel => (
              <div key={hotel._id} className="border rounded-lg p-4 shadow-md">
                <div className="relative">
                  {hotel.imageUrls && hotel.imageUrls.length > 0 && (
                    <img
                      src={hotel.imageUrls[0]}
                      alt={`Image of ${hotel.name}`}
                      className="h-48 w-full object-cover rounded-md"
                    />
                  )}
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    onClick={() => handleDeleteHotel(hotel._id)}
                  >
                    &times;
                  </button>
                </div>
                <h3 className="text-xl font-semibold mt-2">{hotel.name}</h3>
                <p className="text-gray-600">Rating: {hotel.rating}</p>
                <p className="text-gray-600">Price: {hotel.price}</p>
                <p className="text-gray-600">Address: {hotel.address}</p>
                <div className="flex mt-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleBookHotel(hotel._id)}
                  >
                    Book
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleEditHotel(hotel._id)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
      <ToastContainer />
    </UserContext.Provider>
  );
};

export default FullStackHotelApp;
