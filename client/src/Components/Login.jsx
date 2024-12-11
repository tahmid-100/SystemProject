import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Grid, Button, Paper, TextField, Typography } from "@mui/material";

const paperStyle = { padding: '20px', height: '50vh', width: 400, margin: '20px auto' };
const heading = { margin: '20px 0' };
const btnStyle = { marginTop: '20px' };
const row = { marginBottom: '10px' };

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
                    alert("Login failed");
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <Grid align="center" className="wrapper">
            <Paper style={paperStyle}>
                <Typography component="h1" variant="h5" style={heading}>Login</Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        style={row}
                        fullWidth
                        label="Email"
                        variant="outlined"
                        type="email"
                        placeholder="Enter Email"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        style={row}
                        fullWidth
                        label="Password"
                        variant="outlined"
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button style={btnStyle} variant="contained" type="submit">Login</Button>
                </form>
            </Paper>
        </Grid>
    );
};
