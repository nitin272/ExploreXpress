import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { FaEdit } from 'react-icons/fa';
import Loading from './Load';
import './Account.css';

const Account = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState({ name: false, email: false });
    const [editData, setEditData] = useState({ name: '', email: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const loadingTimeout = setTimeout(() => {
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
                setLoading(false);
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
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();
        }, 500);

        return () => clearTimeout(loadingTimeout);
    }, [navigate]);

    const handleEdit = (field) => {
        setIsEditing({ ...isEditing, [field]: true });
        setEditData({ ...editData, [field]: userData[field] });
    };

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (field) => {
        setLoading(true);
        try {
            const response = await fetch(`https://localhost:4000/auth/user/update/${userData.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`,
                },
                body: JSON.stringify({ [field]: editData[field] }),
            });

            if (!response.ok) {
                throw new Error(`Failed to update user data: ${response.statusText}`);
            }
            const updatedData = await response.json();
            setUserData({ ...userData, ...updatedData });
            setIsEditing({ ...isEditing, [field]: false });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Loading />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="account-container">
                {userData ? (
                    <>
                        <div className="user-detail">
                            <h1>Welcome, {isEditing.name ? (
                                <>
                                    <input type="text" name="name" value={editData.name} onChange={handleChange} />
                                    <button onClick={() => handleSubmit('name')}>Save</button>
                                </>
                            ) : (
                                <>
                                    {userData.name || userData.username}
                                    <FaEdit className="edit-icon" onClick={() => handleEdit('name')} />
                                </>
                            )}!</h1>
                        </div>
                        <div className="user-detail">
                            <p>Email: {isEditing.email ? (
                                <>
                                    <input type="email" name="email" value={editData.email} onChange={handleChange} />
                                    <button onClick={() => handleSubmit('email')}>Save</button>
                                </>
                            ) : (
                                <>
                                    {userData.email}
                                    <FaEdit className="edit-icon" onClick={() => handleEdit('email')} />
                                </>
                            )}</p>
                        </div>
                        {userData.imageUrl && (
                            <img src={userData.imageUrl} alt="User Profile" />
                        )}
                    </>
                ) : (
                    <div>Please log in to view your account.</div>
                )}
            </div>
        </>
    );
};

export default Account;
