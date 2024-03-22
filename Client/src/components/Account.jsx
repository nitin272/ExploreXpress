import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';
import Navbar from "../components/Navbar";

const Account = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const { userId, token } = storedUser;

        if (!userId || !token) {
            console.log('Redirecting to login page.');
            navigate('/login');
            return;
        }
        if (storedUser.username && storedUser.email) {
            setUserData(storedUser);
            return;
        }

        
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/auth/user/${userId}`, {
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

    return (
        <>
            <Navbar />
            <div className="account-container">
                {userData ? (
                    <>
                        <h1>Welcome, {userData.username}!</h1>
                        <p>Email: {userData.email}</p>
                        {userData.imageUrl && <img src={userData.imageUrl} alt="User Profile" />}
                    </>
                ) : <div>Please log in to view your account.</div>}
            </div>
        </>
    );
};

export default Account;
