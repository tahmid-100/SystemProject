import { useEffect, useState } from "react";
import axios from "axios";
import './Userprofile.css';

export const Userprofile = () => {
    const [userData, setUserData] = useState(null);
    const [editableData, setEditableData] = useState({
        name: '',
        email: '',
        phonenum: '',
        address: '',
        image: null
    });
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:3001/user/${userId}`)
                .then(response => {
                    setUserData(response.data);
                    setEditableData({
                        name: response.data.name,
                        email: response.data.email,
                        phonenum: response.data.phonenum || "",
                        address: response.data.address || "",
                        image: response.data.image || null
                    });
                })
                .catch(err => {
                    console.log("Error fetching user profile:", err);
                });
        }
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditableData((prevData) => ({
                ...prevData,
                image: file
            }));
        }
    };

    const handleUpdate = () => {
        const formData = new FormData();
        formData.append("name", editableData.name);
        formData.append("phonenum", editableData.phonenum);
        formData.append("address", editableData.address);
        if (editableData.image) {
            formData.append("image", editableData.image);
        }

        axios.put(`http://localhost:3001/user/update/${userId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then(response => {
                alert("Profile updated successfully!");
                setUserData(response.data);
            })
            .catch(err => {
                console.log("Error updating profile:", err);
                alert("Failed to update profile");
            });
    };

    const getCurrentImageSrc = () => {
        if (editableData.image && editableData.image instanceof File) {
            return URL.createObjectURL(editableData.image);
        } else if (userData?.image) {
            return `http://localhost:3001/uploads/${userData.image}`;
        }
        return null;
    };

    return (
        <div className="user-profile">
            <div className="profile-container">
                <div className="profile-header">
                    <h1>Profile</h1>
                    <p className="profile-subtitle">Manage your account information</p>
                </div>

                {userData ? (
                    <>
                        <div className="profile-image-section">
                            <div className="profile-image-container">
                                <img
                                    src={getCurrentImageSrc() || "https://via.placeholder.com/120x120?text=Profile"}
                                    alt="Profile"
                                    className="profile-image"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/120x120?text=Profile";
                                    }}
                                />
                                <label className="image-upload-label" htmlFor="image-upload">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="image-upload-input"
                                />
                            </div>
                            {!getCurrentImageSrc() && (
                                <p className="no-image-message">Click the icon to upload a profile picture</p>
                            )}
                        </div>

                        <div className="profile-form">
                            <div className="input-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={editableData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={editableData.email}
                                    onChange={handleInputChange}
                                    disabled
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="phonenum">Phone Number</label>
                                <input
                                    id="phonenum"
                                    type="tel"
                                    name="phonenum"
                                    value={editableData.phonenum}
                                    onChange={handleInputChange}
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="address">Address</label>
                                <input
                                    id="address"
                                    type="text"
                                    name="address"
                                    value={editableData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter your address"
                                />
                            </div>

                            <button className="update-button" onClick={handleUpdate}>
                                Update Profile
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="loading-message">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                                width: '40px', 
                                height: '40px', 
                                border: '4px solid #e2e8f0', 
                                borderTop: '4px solid #667eea', 
                                borderRadius: '50%', 
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 20px'
                            }}></div>
                            Loading your profile...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}