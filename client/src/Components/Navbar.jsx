import React from "react";
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";

const buttonStyle = { marginLeft: '10px' }; // Define button style

export const Navbar = () => {
  const navigate = useNavigate();

  // Retrieve login status (you can use a more sophisticated method, such as Context or Redux)
  const isLoggedIn = localStorage.getItem("authToken") !== null;

  const handleLogout = () => {
    // Clear authentication token or session data
    localStorage.removeItem("authToken");

    // Navigate to login page
    navigate("/login");
  };

  return (
    <AppBar sx={{ bgcolor: '#333' }}>
      <Toolbar>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Tourists
        </Typography>

        {isLoggedIn ? (
          
          <>

           <Button
              variant="contained"
              sx={buttonStyle}
              color="success"
              component={Link}
              to="/home"
            >
              Home
            </Button>   




           <Button
              variant="contained"
              sx={buttonStyle}
              color="success"
              component={Link}
              to="/userprofile"
            >
              User profile
            </Button>   
             


             
             <Button
              variant="contained"
              sx={buttonStyle}
              color="success"
              component={Link}
              to="/travelplan"
            >
              Our Work
            </Button>



          <Button
            variant="contained"
            sx={buttonStyle}
            color="warning"
            onClick={handleLogout}
          >
            Logout
          </Button>

          </>
          


          ) : (
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
        )}
      </Toolbar>
    </AppBar>
  );
};
