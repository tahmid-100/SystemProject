import React, { useState } from "react";
import { 
  AppBar, Toolbar, Typography, Button, Drawer, List, 
  ListItem, ListItemIcon, ListItemText, Divider, Box 
} from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import TripIcon from '@mui/icons-material/Flight';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export const Navbar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isLoggedIn = localStorage.getItem("authToken") !== null;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
     setIsSidebarOpen(false);
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <AppBar sx={{ bgcolor: '#333' }}>
        <Toolbar>
          {isLoggedIn && (
            <MenuIcon
              sx={{ cursor: 'pointer', marginRight: '10px', color: '#fff' }}
              onClick={toggleSidebar}
            />
          )}
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, color: '#fff' }}>
            Tourists
          </Typography>

          {!isLoggedIn ? (
            <>
              <Button
                variant="outlined"
                sx={{
                  color: "#fff",
                  borderColor: "#fff",
                  marginRight: '10px',
                  textTransform: "none",
                  padding: "6px 15px",
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderColor: "#fff"
                  }
                }}
                component={Link}
                to="/login"
              >
                <LoginIcon sx={{ marginRight: "5px" }} />
                Login
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: "#fff",
                  borderColor: "#fff",
                  textTransform: "none",
                  padding: "6px 15px",
                  display: "flex",
                  alignItems: "center",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderColor: "#fff"
                  }
                }}
                component={Link}
                to="/signup"
              >
                <PersonAddIcon sx={{ marginRight: "5px" }} />
                Signup
              </Button>
            </>
          ) : null}
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        sx={{
          width: 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 260,
            boxSizing: 'border-box',
            backgroundColor: '#2c3e50',
            color: '#fff',
          },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#34495e',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Tourists
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: '#34495e' }} />

        <List>
          <ListItem button component={Link} to="/home" onClick={toggleSidebar}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" sx={{ color: '#fff' }} />
          </ListItem>
          <ListItem button component={Link} to="/userprofile" onClick={toggleSidebar}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="User Profile" sx={{ color: '#fff' }} />
          </ListItem>
          <ListItem button component={Link} to="/travelplan" onClick={toggleSidebar}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary="Our Work" sx={{ color: '#fff' }} />
          </ListItem>
          <ListItem button component={Link} to="/savedplan" onClick={toggleSidebar}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <TripIcon />
            </ListItemIcon>
            <ListItemText primary="Your Trip" sx={{ color: '#fff' }} />
          </ListItem>
          
          <ListItem button component={Link} to="/shop" onClick={toggleSidebar}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Shop" sx={{ color: '#fff' }} />
          </ListItem>

          <ListItem button component={Link} to="/cart" onClick={toggleSidebar}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="My Cart" sx={{ color: '#fff' }} />
          </ListItem>

        </List>

        {/* Logout Button */}
        <List sx={{ marginTop: 'auto' }}>
          <Divider sx={{ backgroundColor: '#34495e' }} />
          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: '#fff' }} />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};
