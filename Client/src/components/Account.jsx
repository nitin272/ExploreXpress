import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';
import Navbar from "../components/Navbar";
import { FaEdit } from 'react-icons/fa'; 
const Account = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserData = JSON.parse(localStorage.getItem('user') || '{}');
      
        const { userId, token, name, email, imageUrl } = storedUserData.user || storedUserData;

        if (!userId) {
            console.log('Redirecting to login page.');
            navigate('/login');
            return;
        }
        
      
        if ((name || storedUserData.username) && email) {
            setUserData({
                ...storedUserData.user, 
                ...storedUserData, 
            });
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch(`https://explorexpress-4.onrender.com/auth/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch user data: ${response.statusText}`);
                }
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchUserData();
    }, [navigate]);

   
    const userName = userData?.name || userData?.username;

    return (
        <>
            <Navbar />
            <div className="account-container">
                {userData ? (
                    <>
                        <div className="user-detail">
                            <h1>Welcome, {userName}!</h1>
                            <FaEdit className="edit-icon" />
                        </div>
                        <div className="user-detail">
                            <p>Email: {userData.email}</p>
                            <FaEdit className="edit-icon" />
                        </div>
                        {userData.imageUrl && <img src={userData.imageUrl} alt="User Profile" />}
                    </>
                ) : <div>Please log in to view your account.</div>}
            </div>
        </>
    );
};

export default Account;
