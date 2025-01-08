import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Grid, Container, Modal, Box, Button } from "@mui/material";

export const Savedplan = () => {
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

    return (
        <Container>
            <Typography variant="h4" gutterBottom sx={{ textAlign: "center", marginTop: "20px" }}>
                Saved Plans
            </Typography>
            {savedPlans.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: "center", marginTop: "20px" }}>
                    No saved plans found.
                </Typography>
            ) : (
                <Grid container spacing={3} sx={{ maxHeight: "80vh", overflowY: "auto" }}>
                    {savedPlans.map(plan => (
                        <Grid item xs={12} sm={6} md={4} key={plan._id}>
                            <Card 
                                onClick={() => handleOpen(plan)} 
                                sx={{ 
                                    backgroundColor: "linear-gradient(135deg, #f5f7fa, #c3cfe2)", 
                                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)", 
                                    borderRadius: "16px", 
                                    cursor: "pointer", 
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    "&:hover": { 
                                        transform: "translateY(-10px)", 
                                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25)" 
                                    } 
                                }}
                            >
                                <CardContent>
                                    <Typography 
                                        variant="h5" 
                                        component="div" 
                                        sx={{ fontWeight: "bold", color: "#2c3e50" }}
                                    >
                                        {plan.location}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ color: "#7f8c8d", marginTop: "8px" }}
                                    >
                                        Duration: {plan.duration} days
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ color: "#7f8c8d", marginTop: "4px" }}
                                    >
                                        Travelers: {plan.travelers}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ color: "#7f8c8d", marginTop: "4px" }}
                                    >
                                        Budget: {plan.budget}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Modal open={open} onClose={handleClose}>
                <Box 
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        maxHeight: "90vh",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "8px",
                        overflowY: "auto"
                    }}
                >
                    {selectedPlan && (
                        <>
                            <Typography variant="h6" component="h2" sx={{ fontWeight: "bold", marginBottom: "16px" }}>
                                {selectedPlan.location}
                            </Typography>
                            <Typography>
                                <strong>Duration:</strong> {selectedPlan.duration} days
                            </Typography>
                            <Typography>
                                <strong>Travelers:</strong> {selectedPlan.travelers}
                            </Typography>
                            <Typography>
                                <strong>Budget:</strong> {selectedPlan.budget}
                            </Typography>
                            <Typography component="div" sx={{ marginTop: "16px" }}>
                                <strong>Hotels:</strong>
                                <ul>
                                    {selectedPlan.hotels.map((hotel, index) => (
                                        <li key={index}>
                                            {hotel.hotelName} - {hotel.hotelAddress} - {hotel.price}
                                        </li>
                                    ))}
                                </ul>
                            </Typography>
                            <Typography component="div" sx={{ marginTop: "16px" }}>
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
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleClose} 
                                sx={{ marginTop: "16px" }}
                            >
                                Close
                            </Button>
                        </>
                    )}
                </Box>
            </Modal>
        </Container>
    );
};
