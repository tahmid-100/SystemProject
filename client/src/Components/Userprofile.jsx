import React, { useEffect, useState } from "react";
import axios from "axios";
import './Userprofile.css'; // Import the CSS file

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

    return (
        <div className="user-profile">
            <h1>User Profile</h1>
            {userData ? (
                <div>
                    <div className="input-group">
                        <label><strong>Name:</strong></label>
                        <input
                            type="text"
                            name="name"
                            value={editableData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="input-group">
                        <label><strong>Email:</strong></label>
                        <input
                            type="email"
                            name="email"
                            value={editableData.email}
                            onChange={handleInputChange}
                            disabled
                        />
                    </div>
                    <div className="input-group">
                        <label><strong>Phone:</strong></label>
                        <input
                            type="text"
                            name="phonenum"
                            value={editableData.phonenum}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="input-group">
                        <label><strong>Address:</strong></label>
                        <input
                            type="text"
                            name="address"
                            value={editableData.address}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="input-group">
                        <label><strong>Profile Image:</strong></label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    {!editableData.image && !userData.image && (
                        <p className="no-image-message">Please choose an image...</p>
                    )}

                    {editableData.image && editableData.image instanceof File ? (
                        <div className="image-preview">
                            <h3>Selected Image:</h3>
                            <img
                                src={URL.createObjectURL(editableData.image)}
                                alt="Profile Preview"
                            />
                        </div>
                    ) : (
                        userData.image && (
                            <div className="image-preview">
                                <h3>Current Image:</h3>
                                <img
                                    src={`http://localhost:3001/uploads/${userData.image}`}
                                    alt="Current Profile"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/path/to/default/image.jpg";
                                    }}
                                />
                            </div>
                        )
                    )}

                    <div>
                        <button onClick={handleUpdate}>Update</button>
                    </div>
                </div>
            ) : (
                <p className="loading-message">Loading profile...</p>
            )}
        </div>
    );
}