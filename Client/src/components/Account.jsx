import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import LoadingSpinner from './Load';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import './Account.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Footer from './Footer';
import config from '../assets/api.json';

const Account = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const apiurl = import.meta.env.VITE_APP_API_URL;
    useEffect(() => {
        const authType = localStorage.getItem('authType');
        if (!authType) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            if (authType === 'manual') {
                const storedUserData = JSON.parse(localStorage.getItem('user') || '{}');
                const { userId, token } = storedUserData.user || storedUserData;
                if (!userId) {
                    navigate('/login');
                    return;
                }
                try {
                    const response = await fetch(`${apiurl}/user/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }
                    const data = await response.json();
                    setUserData(data);
                    setLoading(false);
                } catch (error) {
                    setError(error.message || 'Failed to fetch user data');
                    setLoading(false);
                }
            } else if (authType === 'google') {
                const user = JSON.parse(localStorage.getItem('user'));
                setUserData({
                    name: user.displayName,
                    email: user.email,
                    imageUrl: user.image,
                });
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

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
                alert('Failed to update user data. Please try again later.');
            }
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <LoadingSpinner />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="error-message">{error}</div>
                <button onClick={handleLogout}>Log Out</button>
            </>
        );
    }

    return (
        <>
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 animate-fade-in">
            <Navbar />
            <div className='w-full max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden transition duration-500 ease-in-out hover:shadow-2xl'>
                <div className='px-8 py-6 border-b border-gray-300'>
                    <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
                </div>
                <div className="flex flex-col md:flex-row items-center p-6">
                    {userData ? (
                        <>
                            <div className='flex-shrink-0 w-56 h-56 rounded-full overflow-hidden mt-4 md:mt-0 md:mr-6 transition duration-300 ease-in-out transform hover:scale-110 hover:rotate-6'>
                                <img src={userData.imageUrl || 'defaultProfileImageUrl'} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div className='flex flex-col flex-1'>
                                {isEditing && localStorage.getItem('authType') === 'manual' ? (
                                    <form onSubmit={handleSubmitEdit} className="space-y-5">
                                        <div>
                                            <label className="block text-lg font-medium text-gray-700">Name</label>
                                            <input type="text" name="name" className='mt-1 block w-full px-5 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out hover:border-indigo-300' defaultValue={userData.name} placeholder="Name"/>
                                        </div>
                                        <div>
                                            <label className="block text-lg font-medium text-gray-700">Email</label>
                                            <input type="email" name="email" className='mt-1 block w-full px-5 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out hover:border-indigo-300' defaultValue={userData.email} placeholder="Email"/>
                                        </div>
                                        <button type="submit" className='mt-4 w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition duration-300 ease-in-out'>Save Changes</button>
                                    </form>
                                ) : (
                                    <>
                                        <div className='text-xl font-semibold text-gray-800'>{userData.name}</div>
                                        <div className='text-lg text-gray-500'>{userData.email}</div>
                                        {localStorage.getItem('authType') === 'manual' && (
                                            <button className='mt-5 inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-lg font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out' onClick={toggleEdit}>
                                                Edit Profile <FontAwesomeIcon icon={faEdit} className="ml-2 h-5 w-5" />
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="p-8 text-center">
                            <span className="text-xl text-gray-800">Please log in to view your account.</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="text-center mt-10">
                <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out" onClick={() => navigate('/')}>Return Home</button>
            </div>
        </div>
        <Footer />
        </>
    );
    
    
};

export default Account;
