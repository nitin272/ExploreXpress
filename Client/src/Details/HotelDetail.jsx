import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Footer from '../components/Footer';

// Import images for Leaflet markers
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import Loading from '../components/Load';

// Set up default icon paths in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});



const apiurl = import.meta.env.VITE_APP_API_URL;

const HotelDetail = () => {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const [hotelDetails, setHotelDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${apiurl}/hotel/${hotelId}`)
            .then(response => {
                response.data.coordinates = parseCoordinates(response.data.coordinates);
                setHotelDetails(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch hotel details:', error);
                setError(error.toString());
                setIsLoading(false);
            });
    }, [hotelId]);

    const parseCoordinates = (coordinates) => {
        const parts = coordinates.split(', ');
        return { latitude: parseFloat(parts[0]), longitude: parseFloat(parts[1]) };
    };

    const handleMapClick = () => {
        const { latitude, longitude } = hotelDetails.coordinates;
        window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
    };

    if (isLoading) {
        return <div className="text-center p-5"><Loading /></div>;
    }

    if (error) {
        return <div className="text-center p-5">Error: {error}</div>;
    }

    const goBack = () => navigate(-1);

    return (
        <>
        <Navbar />
    
        <div className="max-w-7xl mx-auto px-4 mt-20 sm:mt-28">
            <button 
                onClick={goBack}
                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 mt-8">
                Back
            </button>
            <h1 className="gradient-text text-4xl lg:text-5xl font-bold shadow-lg transition duration-300 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 mb-6">
                {hotelDetails?.name}
            </h1>
    
            {/* Enhanced Carousel Section */}
            <Carousel className="mt-4 shadow-xl rounded-lg">
                {[hotelDetails?.image1, hotelDetails?.image2, hotelDetails?.image3, hotelDetails?.image4, hotelDetails?.image5].map((img, index) => (
                    <div key={index} className="flex justify-center p-4">
                        <img src={img} alt={`${hotelDetails.name} - Image ${index + 1}`} 
                             className="rounded-lg shadow-xl max-w-xs sm:max-w-sm md:max-w-md" />
                    </div>
                ))}
            </Carousel>
    
            {/* Address and Details Section */}
            <div className="info-section bg-gradient-to-br from-gray-100 to-gray-300 p-12 rounded-xl shadow-lg mt-12 transition duration-700 hover:shadow-2xl">
                <p className="text-gray-900 text-lg mb-8 leading-relaxed font-light">{hotelDetails.description}</p>
                <div className="info-block grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="info-item hover:scale-105 transition-transform duration-300 ease-in-out">
                        <p className="font-semibold text-gray-900 hover:text-white hover:bg-purple-300 rounded-md p-2 shadow-md">
                            <strong className="block mb-1">Address:</strong> {hotelDetails.address}
                        </p>
                    </div>
                    <div className="info-item hover:scale-105 transition-transform duration-300 ease-in-out">
                        <p className="font-semibold text-gray-900 hover:text-white hover:bg-green-300 rounded-md p-2 shadow-md">
                            <strong className="block mb-1">Rating:</strong> {hotelDetails.Rating}
                        </p>
                    </div>
                    <div className="info-item hover:scale-105 transition-transform duration-300 ease-in-out">
                        <p className="font-semibold text-gray-900 hover:text-white hover:bg-blue-300 rounded-md p-2 shadow-md">
                            <strong className="block mb-1">Price:</strong> {hotelDetails.Price} per night
                        </p>
                    </div>
                </div>
            </div>
    
            {/* Interactive Mini Map */}
            <div 
                className="mini-map mt-8 mb-12 w-full h-72 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                onClick={handleMapClick}
            >
                <MapContainer 
                    center={[hotelDetails.coordinates.latitude, hotelDetails.coordinates.longitude]} 
                    zoom={13} 
                    scrollWheelZoom={false} 
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[hotelDetails.coordinates.latitude, hotelDetails.coordinates.longitude]}>
                        <Popup>{hotelDetails.name}</Popup>
                    </Marker>
                </MapContainer>
            </div>
    
        </div>
        <Footer />
    </>
    );    
};

export default HotelDetail;
