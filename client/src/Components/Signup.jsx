import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";

export const SignUp = () => {
    // Define state variables for form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // Handle form submission
    const handleSignUp = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/signup", { name, email, password })
            .then(result => {
                if (result.data.message === "Success") {
                    const user = result.data.user;
                    // Store the user's _id in localStorage or state
                    localStorage.setItem("authToken", "user-token-example");
                    localStorage.setItem("userId", user._id);
                    console.log(user._id);
                    navigate("/home");
                } else {
                    alert("Signup failed. Please check your details.");
                }
            })
            .catch(error => {
                console.error("Error signing up:", error);
                alert("An error occurred. Please try again.");
            });
    };

    return (
        <Box
            sx={{
                backgroundImage: `url('/photos/signup.jpg')`,
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
            <Paper elevation={6} sx={{ padding: 4, maxWidth: 800, width: '40%' }}>
                <Typography variant="h4" gutterBottom>
                    Sign Up
                </Typography>
                <form onSubmit={handleSignUp}>
                    <TextField
                        label="Name"
                        type="text"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Sign Up
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};