import React, { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { AI_PROMPT, SelectBudgetOptions } from "../Constants/Options";
import { SelectTravelsList } from "../Constants/Options";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { chatSession } from "../Service/AIModal";
import axios from "axios";
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    TextField,
    Chip,
} from "@mui/material";

export const TravelPlan = () => {
    const [formData, setFormData] = useState({});
    const userId = localStorage.getItem("userId");

    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const OnGenerateTrip = async () => {
        if (!formData?.location || !formData?.budget || !formData?.traveler || !formData?.noOfDays) {
            toast.error("Please fill all details");
            return;
        }

        if (formData?.noOfDays > 7) {
            toast.warning("Consider shorter trips for better suggestions!");
        }

        const FINAL_PROMPT = AI_PROMPT
            .replace("{location}", formData?.location?.label)
            .replace("{totalDays}", formData?.noOfDays)
            .replace("{traveler}", formData?.traveler)
            .replace("{budget}", formData?.budget);

        console.log(FINAL_PROMPT);
        try {
            const result = await chatSession.sendMessage(FINAL_PROMPT);
            const responseText = await result?.response?.text();
            console.log(responseText);

            const travelPlanData = JSON.parse(responseText);
            travelPlanData.userId = userId;

            const formattedItinerary = Object.keys(travelPlanData.itinerary).map((dayKey) => {
                const dayPlan = travelPlanData.itinerary[dayKey];
                return {
                    day: parseInt(dayKey.replace("day", ""), 10),
                    theme: dayPlan.theme,
                    plan: dayPlan.plan,
                };
            });

            travelPlanData.itinerary = formattedItinerary;

            const response = await axios.post("http://localhost:3001/saveTravelPlan", travelPlanData);
            if (response.status === 201) {
                toast.success("Travel plan saved successfully!");
            }
        } catch (error) {
            console.error("Error saving travel plan:", error);
            toast.error("Failed to save travel plan");
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 10, height: '87vh', overflowY: 'auto'}} >
            <ToastContainer />
            <Typography variant="h4" gutterBottom sx={{ marginTop: "0px" }} >
                Travel Plan ⛺
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                Provide some basic information to generate your travel plan
            </Typography>

            <Grid container spacing={3}>
                {/* Destination */}
                <Grid item xs={12}>
                    <Typography variant="h6">What is your Destination?</Typography>
                    <GooglePlacesAutocomplete
                        autocompletionRequest={{ componentRestrictions: { country: "bd" } }}
                        selectProps={{
                            onChange: (v) => handleInputChange("location", v),
                        }}
                    />
                </Grid>

                {/* Number of Days */}
                <Grid item xs={12}>
                    <Typography variant="h6">How many days are you planning your trip?</Typography>
                    <TextField
                        fullWidth
                        type="number"
                        variant="outlined"
                        placeholder="Enter number of days"
                        onChange={(e) => handleInputChange("noOfDays", e.target.value)}
                    />
                </Grid>

                {/* Budget */}
                <Grid item xs={12}>
                    <Typography variant="h6">What is your budget?</Typography>
                    <Grid container spacing={2}>
                        {SelectBudgetOptions.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card
                                    sx={{
                                        cursor: "pointer",
                                        "&:hover": {
                                            transform: "scale(1.05)",
                                            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                                        },
                                    }}
                                    onClick={() => handleInputChange("budget", item.title)}
                                >
                                    <CardContent>
                                        <Typography variant="h5">{item.icon}</Typography>
                                        <Typography variant="h6">{item.title}</Typography>
                                        <Typography variant="body2">{item.desc}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* Traveler */}
                <Grid item xs={12}>
                    <Typography variant="h6">
                        Who do you plan to travel with on your next adventure?
                    </Typography>
                    <Grid container spacing={2}>
                        {SelectTravelsList.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Chip
                                    label={item.title}
                                    variant={formData.traveler === item.people ? "filled" : "outlined"}
                                    color="primary"
                                    onClick={() => handleInputChange("traveler", item.people)}
                                    sx={{ width: "100%", p: 2, fontSize: "1rem" }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>

            <Box mt={4}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={OnGenerateTrip}
                >
                    Generate Trip
                </Button>
            </Box>
        </Container>
    );
};
