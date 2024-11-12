import React, { useState } from "react";
import { Grid, Paper, Typography, TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import axios from "axios"

const paperStyle = { padding: '20px', height: '60vh', width: 400, margin: '20px auto' };
const heading = { margin: '20px 0' };
const btnStyle = { marginTop: '20px' };
const row = { marginBottom: '10px' };

export const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // Handle form submission
    const handleSignup = (e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/signup", { name, email, password })
        .then(result => {
            if (result.status === 201) {
                navigate("/login");
            }
        })
        .catch(err => {
            if (err.response && err.response.status === 400) {
                window.alert("Email already exists. Please use a different email.");
            } else {
                console.log(err);
            }
        });
    };

    return (
        <Grid align="center" className="wrapper">
            <Paper style={paperStyle} sx={{
                width: {
                    xs: '80vw', // 0
                    sm: '50vw', // 600
                    md: '40vw', // 900
                    lg: '30vw', // 1200
                    xl: '20vw', // 1536
                },
                height: {
                    lg: '60vh', // 1200px and up
                }
            }}>
                <Typography component="h1" variant="h5" style={heading}> Signup </Typography>
                <form onSubmit={handleSignup}>
                    <TextField
                        style={row}
                        sx={{ label: { fontWeight: '700', fontSize: "1.3rem" } }}
                        fullWidth
                        type="text"
                        label="Enter Name"
                        name="name"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        style={row}
                        sx={{ label: { fontWeight: '700', fontSize: "1.3rem" } }}
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
                        sx={{ label: { fontWeight: '700', fontSize: "1.3rem" } }}
                        fullWidth
                        label="Password"
                        variant="outlined"
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button style={btnStyle} variant="contained" type="submit">
                        SignUp
                    </Button>
                </form>
               
            </Paper>
        </Grid>
    );
};
