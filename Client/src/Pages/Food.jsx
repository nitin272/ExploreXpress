import React, { useEffect, useState, createContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Load'; // Corrected import

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
    name: '',
    rating: '',
    address: '',
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
        name: restaurantToEdit.name,
        rating: restaurantToEdit.rating,
        address: restaurantToEdit.address,
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
    if (newRestaurant.imageUrls.length + files.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }

    setNewRestaurant({
      ...newRestaurant,
      imageUrls: [...newRestaurant.imageUrls, ...files.slice(0, 5 - newRestaurant.imageUrls.length)]
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
      formData.append('name', newRestaurant.name);
      formData.append('rating', newRestaurant.rating);
      formData.append('address', newRestaurant.address);
  
      newRestaurant.imageUrls.forEach(file => {
        formData.append('images', file);
      });
  
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
  
      // Handle POST or PUT request based on editMode
      const response = editMode
        ? await axios.put(`${apiurl}/restaurants/${editRestaurantId}`, formData, config)
        : await axios.post(`${apiurl}/restaurants`, formData, config);
  
      console.log('Restaurant added/updated successfully:', response.data);
      // Handle any UI updates or state changes after successful response
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
            setNewRestaurant({ name: '', rating: '', address: '', imageUrls: [] });
          }}
        >
          {showAddRestaurantForm ? "Cancel Add Restaurant" : "Add New Restaurant"}
        </button>
        {showAddRestaurantForm && (
          <div className="mb-5">
            <h3 className="text-xl font-semibold mb-2">{editMode ? 'Edit Restaurant' : 'Add New Restaurant'}</h3>
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Restaurant Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newRestaurant.name}
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
                  value={newRestaurant.rating}
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
                  value={newRestaurant.address}
                  onChange={handleInputChange}
                  required
                  className="p-2 w-full border rounded shadow-sm"
                />
              </div>
              {/* Display existing images with delete option */}
              {newRestaurant.imageUrls.length > 0 && (
                <div className="mb-4">
                  {newRestaurant.imageUrls.map((file, index) => (
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
                {editMode ? 'Update Restaurant' : 'Add Restaurant'}
              </button>
            </form>
          </div>
        )}
        {loading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredRestaurants.map(restaurant => (
              <div key={restaurant._id} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative h-48">
                  {restaurant.imageUrls && restaurant.imageUrls.length > 0 && (
                    <img
                      src={restaurant.imageUrls[0]}
                      alt={`Image of ${restaurant.name}`}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    onClick={() => handleDeleteRestaurant(restaurant._id)}
                  >
                    &times;
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                  <p className="text-gray-600">Rating: {restaurant.rating}</p>
                  <p className="text-gray-600">Address: {restaurant.address}</p>
                  <div className="flex mt-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleBookTable(restaurant._id)}
                    >
                      Book Table
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                      onClick={() => handleEditRestaurant(restaurant._id)}
                    >
                      Edit
                    </button>
                  </div>
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
