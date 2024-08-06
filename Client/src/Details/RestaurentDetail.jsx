import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Footer from '../components/Footer';
import Loading from '../components/Load';

const apiurl = import.meta.env.VITE_APP_API_URL;

const RestaurantDetail = () => {
    const { restaurantId } = useParams();
    const navigate = useNavigate();
    const [restaurantDetails, setRestaurantDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${apiurl}/restaurants/${restaurantId}`)
            .then(response => {
                setRestaurantDetails(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch restaurant details:', error);
                setError(error.toString());
                setIsLoading(false);
            });
    }, [restaurantId]);

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
                <div className="flex justify-between items-center">
                    <button onClick={goBack} className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">
                        Back
                    </button>
                    <h1 className="text-4xl lg:text-5xl font-bold shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 mb-6">
                        {restaurantDetails?.name}
                    </h1>
                </div>

                <Carousel className="mt-4">
                    {restaurantDetails?.imageUrls.map((img, index) => (
                        <div key={index} className="flex justify-center">
                            <img src={img} alt={`${restaurantDetails.name} - Image ${index + 1}`} className="rounded-lg shadow-lg max-w-full h-auto md:max-w-lg lg:max-w-xl" />
                        </div>
                    ))}
                </Carousel>

                <div className="info-section bg-gradient-to-br from-gray-100 to-gray-300 p-12 rounded-xl shadow-lg mt-12 transition duration-700 hover:shadow-2xl">
                    <p className="text-gray-900 text-lg mb-8 leading-relaxed font-light">{restaurantDetails.description}</p>
                    <div className="info-block">
                        <p className="info-item font-semibold text-gray-900 mb-2 transition-all duration-300 ease-in-out hover:bg-purple-300 hover:text-white rounded-md p-2 shadow-md">
                            <strong className="block mb-1 text-purple-800">Address:</strong> {restaurantDetails.address}
                        </p>
                        <p className="info-item font-semibold text-gray-900 mb-2 transition-all duration-300 ease-in-out hover:bg-orange-300 hover:text-white rounded-md p-2 shadow-md">
                            <strong className="block mb-1 text-orange-800">Cuisine:</strong> {restaurantDetails.cuisine}
                        </p>
                        <p className="info-item font-semibold text-gray-900 mb-0 transition-all duration-300 ease-in-out hover:bg-blue-300 hover:text-white rounded-md p-2 shadow-md">
                            <strong className="block mb-1 text-blue-800">Price Range:</strong> {restaurantDetails.range}
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default RestaurantDetail;
