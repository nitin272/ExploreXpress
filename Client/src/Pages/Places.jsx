import React, { useEffect, useState, createContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Load'; // Updated Loading component import

const UserContext = createContext();

const FamousPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editPlaceId, setEditPlaceId] = useState(null);
  const [showAddPlaceForm, setShowAddPlaceForm] = useState(false);

  const [newPlace, setNewPlace] = useState({
    name: '',
    city: '',
    description: '',
    address: '',
    imageUrls: [],
    link: '', // New field
    timing: '', // New field
    cost: '' // New field
  });

  const navigate = useNavigate();
  const apiurl = import.meta.env.VITE_APP_API_URL; // Assuming this is correctly defined in your environment

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

  const handleEditPlace = (placeId) => {
    const placeToEdit = places.find(place => place._id === placeId);
    if (placeToEdit) {
      setEditMode(true);
      setEditPlaceId(placeId);
      setNewPlace({
        name: placeToEdit.name,
        city: placeToEdit.city,
        description: placeToEdit.description,
        address: placeToEdit.address,
        imageUrls: placeToEdit.imageUrls || [],
        link: placeToEdit.link || '', // New field
        timing: placeToEdit.timing || '', // New field
        cost: placeToEdit.cost || '' // New field
      });
      setShowAddPlaceForm(true);
    } else {
      console.error('Place not found for editing');
    }
  };

  const handleDeletePlace = (placeId) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      axios.delete(`${apiurl}/places/${placeId}`)
        .then(response => {
          console.log('Place deleted successfully:', response.data);
          const updatedPlaces = places.filter(place => place._id !== placeId);
          setPlaces(updatedPlaces);
        })
        .catch(error => {
          console.error('Error deleting place:', error);
          alert('Failed to delete place. Please try again.');
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlace({
      ...newPlace,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (newPlace.imageUrls.length + files.length > 5) {
      alert("You can upload a maximum of 5 images.");
      return;
    }

    setNewPlace({
      ...newPlace,
      imageUrls: [...newPlace.imageUrls, ...files.slice(0, 5 - newPlace.imageUrls.length)]
    });
  };

  const handleDeleteImage = async (index) => {
    const imageUrl = newPlace.imageUrls[index];
    if (!imageUrl) return;

    try {
      await axios.delete(`${apiurl}/places/${editPlaceId}/images`, {
        data: { imageUrls: [imageUrl] }
      });

      setNewPlace((prevPlace) => ({
        ...prevPlace,
        imageUrls: prevPlace.imageUrls.filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', newPlace.name);
      formData.append('city', newPlace.city);
      formData.append('description', newPlace.description);
      formData.append('address', newPlace.address);
      formData.append('link', newPlace.link); // New field
      formData.append('timing', newPlace.timing); // New field
      formData.append('cost', newPlace.cost); // New field

      newPlace.imageUrls.forEach(file => {
        formData.append('images', file);
      });

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = editMode
        ? await axios.put(`${apiurl}/places/${editPlaceId}`, formData, config)
        : await axios.post(`${apiurl}/places`, formData, config);

      console.log('Place added/updated successfully:', response.data);

      setPlaces((prevPlaces) => {
        if (editMode) {
          return prevPlaces.map(place =>
            place._id === editPlaceId ? response.data : place
          );
        } else {
          return [...prevPlaces, response.data];
        }
      });

      setShowAddPlaceForm(false);
      setEditMode(false);
      setEditPlaceId(null);
      setNewPlace({
        name: '',
        city: '',
        description: '',
        address: '',
        imageUrls: [],
        link: '', // New field
        timing: '', // New field
        cost: '' // New field
      });
    } catch (error) {
      console.error('Error adding/updating place:', error);
      alert('Failed to add/update place. Please try again.');
    }
  };

  const filteredPlaces = searchQuery
    ? places.filter(place => place.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : places;

  return (
    <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <Navbar />
      <div className="container mx-auto px-4 pt-16">
        <h2 className="text-3xl font-semibold mb-8">Explore Famous Places</h2>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by place name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 w-full md:w-1/3 border rounded shadow-sm"
          />
          {isLoggedIn && (
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow"
              onClick={() => setShowAddPlaceForm(!showAddPlaceForm)}
            >
              {showAddPlaceForm ? 'Cancel Add Place' : 'Add New Place'}
            </button>
          )}
        </div>

        {showAddPlaceForm && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">{editMode ? 'Edit Place' : 'Add New Place'}</h3>
            <form onSubmit={handleSubmit} className="max-w-lg">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Place Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newPlace.name}
                  onChange={handleInputChange}
                  required
                  className="p-2 w-full border rounded shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={newPlace.city}
                  onChange={handleInputChange}
                  required
                  className="p-2 w-full border rounded shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newPlace.description}
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
                  value={newPlace.address}
                  onChange={handleInputChange}
                  required
                  className="p-2 w-full border rounded shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="link" className="block text-sm font-medium text-gray-700">Link</label>
                <input
                  type="text"
                  id="link"
                  name="link"
                  value={newPlace.link}
                  onChange={handleInputChange}
                  required
                  className="p-2 w-full border rounded shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="timing" className="block text-sm font-medium text-gray-700">Timing</label>
                <input
                  type="text"
                  id="timing"
                  name="timing"
                  value={newPlace.timing}
                  onChange={handleInputChange}
                  required
                  className="p-2 w-full border rounded shadow-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700">Cost</label>
                <input
                  type="text"
                  id="cost"
                  name="cost"
                  value={newPlace.cost}
                  onChange={handleInputChange}
                  required
                  className="p-2 w-full border rounded shadow-sm"
                />
              </div>
              {newPlace.imageUrls.length > 0 && (
                <div className="mb-4">
                  {newPlace.imageUrls.map((file, index) => (
                    <div key={index} className="relative inline-block mr-2 mb-2">
                      <img
                        src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                        alt={`Place Image ${index + 1}`}
                        className="h-20 w-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 shadow-sm"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-sm"
                >
                  {editMode ? 'Update Place' : 'Add Place'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div key={place._id} className="border rounded-lg overflow-hidden shadow-md">
              <img
                src={place.imageUrls[0]}
                alt={place.name}
                className="w-full h-48 object-cover object-center"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{place.name}</h3>
                <p className="text-gray-600 mb-2">City: {place.city}</p>
                <p className="text-gray-600 mb-2">Address: {place.address}</p>
                <p className="text-gray-800 mb-4">{place.description}</p>
                <div className="flex justify-between items-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-sm"
                    onClick={() => handleMoreDetails(place._id)}
                  >
                    More Details
                  </button>
                  {isLoggedIn && (
                    <div className="flex gap-2">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded shadow-sm"
                        onClick={() => handleEditPlace(place._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-sm"
                        onClick={() => handleDeletePlace(place._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center mt-8">
            <Loading />
          </div>
        )}
      </div>
      <Footer />
    </UserContext.Provider>
  );
};

export default FamousPlaces;
