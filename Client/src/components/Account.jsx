import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import LoadingSpinner from './Load';
import Footer from './Footer';
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';

const Account = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const navigate = useNavigate();

    const apiurl = import.meta.env.VITE_APP_API_URL;

    useEffect(() => {
        const authType = localStorage.getItem('authType');
        if (!authType) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {


            try {
                const storedUserData = JSON.parse(localStorage.getItem('user') || '{}');


                const { userId, token } = storedUserData.user || storedUserData;

                
                if (!userId) {
                    navigate('/login');
                    return;
                }

                const response = await fetch(`${apiurl}/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const contentType = response.headers.get('content-type');
                if (contentType && contentType.indexOf('application/json') !== -1) {
                    const data = await response.json();
                    setUserData({
                        name: data.username,
                        email: data.email,
                        profileImageUrl: data.imageUrl,
                        coverImageUrl: data.coverImageUrl || '',
                    });
                } else {
                    throw new Error('Oops! Unexpected response format.');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user data');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [apiurl, navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const toggleEdit = () => {
        const authType = localStorage.getItem('authType');
        if (authType === 'manual') {
            setIsEditing(true);
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const authType = localStorage.getItem('authType');
        if (authType === 'manual') {
            const storedUserData = JSON.parse(localStorage.getItem('user') || '{}');
            const { userId, token } = storedUserData.user || storedUserData;

            const name = e.target.elements.name.value;
            const email = e.target.elements.email.value;

            try {
                const response = await fetch(`${apiurl}/user/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name, email }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update user data');
                }

                const responseData = await response.json();
                setUserData(responseData.user);
                setIsEditing(false);
            } catch (error) {
                console.error('Failed to update user data:', error);
                alert('Failed to update user data. Please try again later.');
            }
        }
    };

    const handleUploadCoverImage = async () => {
        const authType = localStorage.getItem('authType');
        if (authType === 'manual' && coverImageFile) {
            const storedUserData = JSON.parse(localStorage.getItem('user') || '{}');
            const { userId, token } = storedUserData.user || storedUserData;

            const formData = new FormData();
            formData.append('coverImage', coverImageFile);

            try {
                const response = await fetch(`${apiurl}/user/${userId}/cover-image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to upload cover image');
                }

                const responseData = await response.json();
                setUserData(prevData => ({
                    ...prevData,
                    coverImageUrl: responseData.coverImageUrl,
                }));

                setCoverImageFile(null);
            } catch (error) {
                console.error('Failed to upload cover image:', error);
                alert('Failed to upload cover image. Please try again later.');
            }
        } else {
            alert('Please select a cover image to upload.');
        }
    };

    const handleDeleteCoverImage = async () => {
        const authType = localStorage.getItem('authType');
        if (authType === 'manual' && userData.coverImageUrl) {
            const storedUserData = JSON.parse(localStorage.getItem('user') || '{}');
            const { userId, token } = storedUserData.user || storedUserData;

            try {
                const response = await fetch(`${apiurl}/user/${userId}/cover-image`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete cover image');
                }

                setUserData(prevData => ({
                    ...prevData,
                    coverImageUrl: '',
                }));
            } catch (error) {
                console.error('Failed to delete cover image:', error);
                alert('Failed to delete cover image. Please try again later.');
            }
        } else {
            alert('No cover image to delete.');
        }
    };

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        setCoverImageFile(file);
    };

    const renderProfileImageEditButton = () => {
        return null; // Placeholder function since image upload functionality is removed
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
                <Navbar />
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
                <Navbar />
                <div className="error-message">{error}</div>
                <button onClick={handleLogout} className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out">
                    Log Out
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg sm:overflow-visible">
                    <div className="relative">
                        <img
                            src={userData.coverImageUrl || 'https://via.placeholder.com/150'}
                            alt="Cover"
                            className="w-full h-48 sm:h-64 object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-black opacity-40"></div>
                        {isEditing && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <label htmlFor="coverImageInput" className="cursor-pointer">
                                    <AiOutlinePlus className="text-3xl text-gray-100 bg-gray-700 p-2 rounded-full hover:bg-gray-600" />
                                </label>
                                {userData.coverImageUrl && (
                                    <button
                                        onClick={handleDeleteCoverImage}
                                        className="ml-4 cursor-pointer"
                                    >
                                        <AiOutlineClose className="text-3xl text-gray-100 bg-gray-700 p-2 rounded-full hover:bg-gray-600" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="relative flex flex-col items-center sm:flex-row sm:justify-between px-6 py-8">
                        <div className="relative mb-6 sm:mb-0">
                            <img
                                src={userData.profileImageUrl || 'https://via.placeholder.com/150'}
                                alt="Profile"
                                className="h-32 w-32 sm:h-48 sm:w-48 rounded-full ring-4 ring-white object-cover object-center"
                                style={{ position: 'relative', top: '-50px' }}
                            />
                            {renderProfileImageEditButton()}
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-4xl font-bold text-gray-900">{userData.name}</h1>
                            <p className="text-2xl text-gray-600">{userData.email}</p>
                            {localStorage.getItem('authType') === 'manual' && (
                                <div className="mt-4 flex items-center">
                                    <input type="file" onChange={handleCoverImageChange} accept="image/*" className="hidden" id="coverImageInput" />
                                    <label htmlFor="coverImageInput" className="cursor-pointer mr-4">
                                        <AiOutlinePlus className="text-xl text-gray-500 hover:text-gray-700" />
                                    </label>
                                    <button
                                        onClick={isEditing ? handleSubmitEdit : toggleEdit}
                                        className={`px-4 py-2 border border-transparent text-lg font-medium rounded-md text-white ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out`}
                                    >
                                        {isEditing ? 'Save' : 'Edit Profile'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Account;
