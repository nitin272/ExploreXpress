import React, { useEffect, useState, createContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Load';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserContext = createContext();

const apiurl = import.meta.env.VITE_APP_API_URL; // Assuming this points to your backend API URL

const FullStackRestaurantApp = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editRestaurantId, setEditRestaurantId] = useState(null);
  const [showAddRestaurantForm, setShowAddRestaurantForm] = useState(false);

  const [newRestaurant, setNewRestaurant] = useState({
    city: '',
    name: '',
    rating: 'Not Rated',
    address: '',
    range: '',
    cuisine: '',
    imageUrls: []
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
    axios.get(`${apiurl}/restaurants`)
      .then(response => {
        setRestaurants(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the restaurants data:', error);
        alert('Failed to fetch restaurants. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleBookTable = (restaurantId) => {
    if (!isLoggedIn) {
      alert("Please log in to book tables.");
      return;
    }
    navigate(`/restaurant/${restaurantId}`);
  };

  const handleEditRestaurant = (restaurantId) => {
    const restaurantToEdit = restaurants.find(restaurant => restaurant._id === restaurantId);
    if (restaurantToEdit) {
      setEditMode(true);
      setEditRestaurantId(restaurantId);
      setNewRestaurant({
        city: restaurantToEdit.city,
        name: restaurantToEdit.name,
        rating: restaurantToEdit.rating,
        address: restaurantToEdit.address,
        range: restaurantToEdit.range,
        cuisine: restaurantToEdit.cuisine,
        imageUrls: restaurantToEdit.imageUrls // Assuming imageUrls is an array of URLs
      });
      setShowAddRestaurantForm(true); // Show the form
    } else {
      console.error('Restaurant not found for editing');
    }
  };

  const handleDeleteRestaurant = (restaurantId) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      axios.delete(`${apiurl}/restaurants/${restaurantId}`)
        .then(response => {
          console.log('Restaurant deleted successfully:', response.data);
          const updatedRestaurants = restaurants.filter(restaurant => restaurant._id !== restaurantId);
          setRestaurants(updatedRestaurants);
        })
        .catch(error => {
          console.error('Error deleting restaurant:', error);
          alert('Failed to delete restaurant. Please try again.');
        });
    }
  };

  const filteredRestaurants = searchQuery
    ? restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : restaurants;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant({
      ...newRestaurant,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (newRestaurant.imageUrls.length + files.length > 10) {
      alert("You can upload a maximum of 10 images.");
      return;
    }

    setNewRestaurant({
      ...newRestaurant,
      imageUrls: [...newRestaurant.imageUrls, ...files.slice(0, 10 - newRestaurant.imageUrls.length)]
    });
  };

  const handleDeleteImage = async (index) => {
    const imageUrl = newRestaurant.imageUrls[index];
    if (!imageUrl) return;

    try {
      const response = await axios.delete(`${apiurl}/restaurants/${editRestaurantId}/images`, {
        data: { imageUrls: [imageUrl] }
      });

      if (response.status === 200) {
        // Assuming success means the image was deleted from backend
        setNewRestaurant((prevRestaurant) => ({
          ...prevRestaurant,
          imageUrls: prevRestaurant.imageUrls.filter((_, i) => i !== index)
        }));
      } else {
        console.error('Error deleting image:', response.statusText);
        alert('Failed to delete image. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting image:', error.message);
      alert('Failed to delete image. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('city', newRestaurant.city);
      formData.append('name', newRestaurant.name);
      formData.append('rating', newRestaurant.rating);
      formData.append('address', newRestaurant.address);
      formData.append('range', newRestaurant.range);
      formData.append('cuisine', newRestaurant.cuisine);
  
      newRestaurant.imageUrls.forEach(file => {
        if (typeof file === 'string') {
          formData.append('imageUrls', file);
        } else {
          formData.append('images', file);
        }
      });
  
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
  
      const response = editMode
        ? await axios.put(`${apiurl}/restaurants/${editRestaurantId}`, formData, config)
        : await axios.post(`${apiurl}/restaurants`, formData, config);
  
      console.log('Restaurant added/updated successfully:', response.data);
      toast.success(`Restaurant ${editMode ? 'updated' : 'added'} successfully!`);
  
      if (editMode) {
        setRestaurants(restaurants.map((restaurant) =>
          restaurant._id === editRestaurantId ? response.data : restaurant
        ));
      } else {
        setRestaurants([...restaurants, response.data]);
      }
  
      setShowAddRestaurantForm(false);
      setNewRestaurant({
        city: '',
        name: '',
        rating: 'Not Rated',
        address: '',
        range: '',
        cuisine: '',
        imageUrls: []
      });
      setEditMode(false);
      setEditRestaurantId(null);
    } catch (error) {
      console.error('Error adding/updating restaurant:', error);
      alert('Failed to add/update restaurant. Please try again.');
    }
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Navbar />
      <div className="container mx-auto px-4 pt-16">
        <h2 className="text-2xl font-semibold my-4">All Cities Restaurants</h2>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => {
            setShowAddRestaurantForm(!showAddRestaurantForm);
            setEditMode(false); // Ensure edit mode is turned off
            setEditRestaurantId(null);
            setNewRestaurant({
              city: '',
              name: '',
              rating: 'Not Rated',
              address: '',
              range: '',
              cuisine: '',
              imageUrls: []
            });
          }}
        >
          {showAddRestaurantForm ? "Cancel Add Restaurant" : "Add New Restaurant"}
        </button>
        {showAddRestaurantForm && (
          <div className="mb-5">
            <h3 className="text-xl font-semibold mb-2">{editMode ? 'Edit Restaurant' : 'Add New Restaurant'}</h3>
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={newRestaurant.city}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newRestaurant.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                <select
                  id="rating"
                  name="rating"
                  value={newRestaurant.rating}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option>Not Rated</option>
                  <option>1</option>
                  <option>1.5</option>
                  <option>2</option>
                  <option>2.5</option>
                  <option>3</option>
                  <option>3.5</option>
                  <option>4</option>
                  <option>4.5</option>
                  <option>5</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={newRestaurant.address}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="range" className="block text-sm font-medium text-gray-700">Price Range</label>
                <input
                  type="text"
                  id="range"
                  name="range"
                  value={newRestaurant.range}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700">Cuisine</label>
                <input
                  type="text"
                  id="cuisine"
                  name="cuisine"
                  value={newRestaurant.cuisine}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="imageUrls" className="block text-sm font-medium text-gray-700">Images (max 10)</label>
                <input
                  type="file"
                  id="imageUrls"
                  name="imageUrls"
                  multiple
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {newRestaurant.imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      {typeof url === 'string' ? (
                        <img src={url} alt={`Preview ${index}`} className="w-24 h-24 object-cover rounded-md border" />
                      ) : (
                        <img src={URL.createObjectURL(url)} alt={`Preview ${index}`} className="w-24 h-24 object-cover rounded-md border" />
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {editMode ? 'Update Restaurant' : 'Add Restaurant'}
              </button>
            </form>
          </div>
        )}
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant._id} className="bg-white rounded-lg shadow-md p-4">
                <img src={restaurant.imageUrls[0]} alt={restaurant.name} className="w-full h-48 object-cover rounded-t-lg mb-4" />
                <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                <p className="text-sm text-gray-700">{restaurant.address}</p>
                <p className="text-sm text-gray-500">Rating: {restaurant.rating}</p>
                <p className="text-sm text-gray-500">Price Range: {restaurant.range}</p>
                <p className="text-sm text-gray-500">Cuisine: {restaurant.cuisine}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleBookTable(restaurant._id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Book Table
                  </button>
                  {isLoggedIn && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditRestaurant(restaurant._id)}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRestaurant(restaurant._id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </UserContext.Provider>
  );
};

export default FullStackRestaurantApp;
