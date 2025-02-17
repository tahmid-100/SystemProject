import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";

export const Login = () => {
    // Define state variables for form fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // Handle form submission
    const handleLogin = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/login", { email, password })
            .then(result => {
                if (result.data.message === "Success") {
                    const user = result.data.user;
                    // Store the user's _id in localStorage or state
                    localStorage.setItem("authToken", "user-token-example");
                    localStorage.setItem("userId", user._id);
                    console.log(user._id);
                    navigate("/home");
                } else {
                    alert("Login failed. Please check your credentials.");
                }
            })
            .catch(error => {
                console.error("Error logging in:", error);
                alert("An error occurred. Please try again.");
            });
    };

    return (
        <Box
            sx={{
                backgroundImage: `url('/photos/login.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: 4,
                    maxWidth: 400,
                    width: '90%',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparent background
                    backdropFilter: 'blur(10px)', // Glass morphism effect
                    border: '1px solid rgba(255, 255, 255, 0.3)', // Light border
                    borderRadius: '16px', // Rounded corners
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Soft shadow
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#fff', // White text
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)', // Text shadow for better readability
                    }}
                >
                    Login
                </Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
                            borderRadius: '8px', // Rounded corners
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)', // Light border
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.8)', // Hover effect
                                },
                            },
                        }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
                            borderRadius: '8px', // Rounded corners
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.5)', // Light border
                                },
                                '&:hover fieldset': {
                                    borderColor: 'rgba(255, 255, 255, 0.8)', // Hover effect
                                },
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{
                            mt: 2,
                            backgroundColor: 'rgba(0, 123, 255, 0.9)', // Semi-transparent button
                            color: '#fff',
                            borderRadius: '8px', // Rounded corners
                            '&:hover': {
                                backgroundColor: 'rgba(0, 123, 255, 1)', // Solid color on hover
                            },
                        }}
                    >
                        Login
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};