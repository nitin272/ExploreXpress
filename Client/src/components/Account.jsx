import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import LoadingSpinner from './Load';
import './Account.css'; // Ensure this CSS file is updated according to the new styles

const Account = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const storedUserData = JSON.parse(localStorage.getItem('user') || '{}');
            const { userId, token } = storedUserData.user || storedUserData;
            if (!userId) {
                navigate('/login');
                return;
            }
            try {
                const response = await fetch(`https://explore-xpress.onrender.com/user/${userId}`, {
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
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const toggleEdit = async () => {
        const password = prompt("Please enter your password to continue:");
        if (!password) {
            alert("Password is required to edit your details.");
            return;
        }
        const storedUserData = JSON.parse(localStorage.getItem('user') || '{}');
        const { userId, token } = storedUserData.user || storedUserData;

        try {
            const response = await fetch('https://explore-xpress.onrender.com/verify-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userId, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to verify password');
            }

            setIsEditing(true);
        } catch (error) {
            alert(error.message || "An error occurred. Please try again.");
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        const storedUserData = JSON.parse(localStorage.getItem('user') || '{}');
        const { userId, token } = storedUserData.user || storedUserData;

        const name = e.target.elements.name.value;
        const email = e.target.elements.email.value;

        try {
            const response = await fetch(`http://localhost:4000/user/${userId}`, {
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
            const updatedData = await response.json();
            setUserData(updatedData.user);
            setIsEditing(false);
        } catch (error) {
            alert('Failed to update user data. Please try again later.');
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
        <div className="profile-container">
            <Navbar />
            <div className='profileDev'>
                <h1 className="profile-heading">Profile</h1>
            </div>
            <div className="flex">
                {userData ? (
                    <>
                        <div className='profileImg' style={{ backgroundImage: `url(${userData.imageUrl || 'defaultProfileImageUrl'})` }}></div>
                        <div className='profileInfo'>
                            {isEditing ? (
                                <>
                                    <input type="text" className='NameInput' defaultValue={userData.name} placeholder="Name"/>
                                    <input type="text" className='EmailInput' defaultValue={userData.email} placeholder="Email"/>
                                    <button className='EditBtn' onClick={handleSubmitEdit}>Save</button>
                                </>
                            ) : (
                                <>
                                    <div className='NameInput2'>{userData.name}</div>
                                    <div className='EmailInput'>{userData.email}</div>
                                    <button className='EditBtn' onClick={() => setIsEditing(true)}>Edit</button>
                                </>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="no-user">Please log in to view your account.</div>
                )}
            </div>
            <div>
                <button className="LogoutBtn" onClick={handleLogout}>Logout</button>
                <button className="HomeBtn" onClick={() => navigate('/')}>Home</button>
            </div>
        </div>
    );
};

export default Account;
