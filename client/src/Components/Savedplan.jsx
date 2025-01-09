import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Container,
  Modal,
  Box,
  Button,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import { Delete, Close, LocationOn, CalendarToday, People, MonetizationOn } from "@mui/icons-material";

export const SavedPlan = () => {
  const userId = localStorage.getItem("userId");
  const [savedPlans, setSavedPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchSavedPlans = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/getTravelPlans/${userId}`);
        setSavedPlans(response.data);
      } catch (error) {
        console.error("Error fetching saved plans:", error);
      }
    };

    fetchSavedPlans();
  }, [userId]);

  const handleOpen = (plan) => {
    setSelectedPlan(plan);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPlan(null);
  };

  const handleDelete = async (planId) => {
    try {
      await axios.delete(`http://localhost:3001/deleteTravelPlan/${planId}`);
      setSavedPlans(savedPlans.filter(plan => plan._id !== planId));
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Saved Plans
      </Typography>
      <Grid container spacing={4}>
        {savedPlans.length === 0 ? (
          <Typography variant="body1" align="center" sx={{ width: "100%", mt: 4 }}>
            No saved plans found.
          </Typography>
        ) : (
          savedPlans.map(plan => (
            <Grid item xs={12} sm={6} md={4} key={plan._id}>
              <Card
                sx={{
                  background: "linear-gradient(135deg, #e0f7fa, #80deea)",
                  borderRadius: "16px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#004d40",
                      mb: 1,
                      cursor: "pointer",
                    }}
                    onClick={() => handleOpen(plan)}
                  >
                    <LocationOn sx={{ verticalAlign: "middle", mr: 1 }} />
                    {plan.location}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", color: "#00695c" }}>
                    <CalendarToday sx={{ fontSize: 16, mr: 1 }} /> Duration: {plan.duration} days
                  </Typography>
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", color: "#00695c" }}>
                    <People sx={{ fontSize: 16, mr: 1 }} /> Travelers: {plan.travelers}
                  </Typography>
                  <Typography variant="body2" sx={{ display: "flex", alignItems: "center", color: "#00695c" }}>
                    <MonetizationOn sx={{ fontSize: 16, mr: 1 }} /> Budget: {plan.budget}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <Tooltip title="Delete Plan">
                    <IconButton color="error" onClick={() => handleDelete(plan._id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Modal open={open} onClose={handleClose}>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "80%",
      maxHeight: "90vh", // Limit height to 90% of viewport
      overflowY: "auto", // Enable vertical scrolling
      bgcolor: "background.paper",
      boxShadow: 24,
      p: 4,
      borderRadius: "16px", // Rounded corners for modern look
    }}
  >
    {selectedPlan && (
      <>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#004d40" }}>
            {selectedPlan.location}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ mt: 2 }}>
          <Typography>
            <strong>Duration:</strong> {selectedPlan.duration} days
          </Typography>
          <Typography>
            <strong>Travelers:</strong> {selectedPlan.travelers}
          </Typography>
          <Typography>
            <strong>Budget:</strong> {selectedPlan.budget}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Hotels:</strong>
            <ul>
              {selectedPlan.hotels.map((hotel, index) => (
                <li key={index}>
                  {hotel.hotelName} - {hotel.hotelAddress} - {hotel.price}
                </li>
              ))}
            </ul>
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Itinerary:</strong>
            <ul>
              {selectedPlan.itinerary.map((day, index) => (
                <li key={index}>
                  <strong>Day {day.day}:</strong> {day.theme}
                  <ul>
                    {day.plan.map((place, idx) => (
                      <li key={idx}>
                        {place.placeName} - {place.placeDetails}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Typography>
        </Box>
      </>
    )}
  </Box>
</Modal>


    </Container>
  );
};
