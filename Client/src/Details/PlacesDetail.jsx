import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from '../components/Load';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const apiurl = import.meta.env.VITE_APP_API_URL;

const PlaceDetail = () => {
    const { placeId } = useParams();
    const navigate = useNavigate();
    const [placeDetails, setPlaceDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`${apiurl}/places/${placeId}`)
            .then(response => {
                const data = response.data;
                setPlaceDetails(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch place details:', error);
                setError(error.toString());
                setIsLoading(false);
            });
    }, [placeId]);

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
                        {placeDetails?.name}
                    </h1>
                </div>

                <Carousel className="mt-4">
                    {placeDetails?.imageUrls.map((img, index) => (
                        <div key={index} className="flex justify-center">
                            <img src={img} alt={`${placeDetails.name} - Image ${index + 1}`} className="rounded-lg shadow-lg max-w-full h-auto md:max-w-lg lg:max-w-xl" />
                        </div>
                    ))}
                </Carousel>

                <div className="info-section bg-gradient-to-br from-gray-100 to-gray-300 p-12 rounded-xl shadow-lg mt-12 transition duration-700 hover:shadow-2xl">
                    <p className="text-gray-900 text-lg mb-8 leading-relaxed font-light"> Description:<br/>{placeDetails.description}</p>
                    <p className="info-item font-semibold text-gray-900 mb-2 transition-all duration-300 ease-in-out hover:bg-purple-300 hover:text-white rounded-md p-2 shadow-md">
                        <strong className="block mb-1 text-purple-800">Address:</strong> {placeDetails.address}
                    </p>
                    <p className="info-item font-semibold text-gray-900 mb-2 transition-all duration-300 ease-in-out hover:bg-orange-300 hover:text-white rounded-md p-2 shadow-md">
                        <strong className="block mb-1 text-orange-800">Visit Link:</strong> <a href={placeDetails.link} className="underline text-blue-500 hover:text-blue-800" target="_blank" rel="noopener noreferrer">Learn more</a>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PlaceDetail;
