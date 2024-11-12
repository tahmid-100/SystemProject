import React from "react";
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from "react-router-dom";

const buttonStyle = { marginLeft: '10px' }; // Define button style

export const Navbar = () => {
  const isLoggedIn = false; // Set to true if user is logged in (you can replace this with your auth logic)

  return (
    <>
      <AppBar sx={{ bgcolor: '#333' }}>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Tourists
          </Typography>
          
          
            <Button
              variant="contained"
              sx={buttonStyle}
              color="warning"
              onClick={() => {
                // Add logout logic here
                console.log("User logged out");
              }}
            >
              Logout
            </Button>
        
            <>
              <Button
                variant="contained"
                sx={buttonStyle}
                color="error"
                component={Link}
                to="/login"
              >
                Login
              </Button>
              <Button
                variant="contained"
                sx={buttonStyle}
                color="success"
                component={Link}
                to="/signup"
              >
                Signup
              </Button>
            </>
       
        </Toolbar>
      </AppBar>
    </>
  );
};
