import React, { useState, useEffect } from "react"; // Import useEffect here
import {  LoadScript } from "@react-google-maps/api";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { AI_PROMPT, SelectBudgetOptions } from "../Constants/Options";
import { SelectTravelsList } from "../Constants/Options";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { chatSession } from "../Service/AIModal";


export const TravelPlan = () => {
    
    
    const [formData, setFormData] = useState([]);

    const handleInputChange=(name,value)=>{
        setFormData({

            ...formData,
            [name]:value
        })

    }

    
    useEffect(() => {

       
        
    }, [formData]); 

    const OnGenerateTrip = async() => {
        if (!formData?.location || !formData?.budget || !formData?.traveler || !formData?.noOfDays) {
            toast.error("Please fill all details", {
                position: "top-right",
                autoClose: 3000, // Automatically closes after 3 seconds
                hideProgressBar: true,
            });
            return;
        }
    
        if (formData?.noOfDays > 7) {
            toast.warning("Consider shorter trips for better suggestions!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
            });
        }
    
        const FINAL_PROMPT=AI_PROMPT
        .replace('{location}',formData?.location?.label)
        .replace('{totalDays}',formData?.noOfDays)
        .replace('{traveler}',formData?.traveler)
        .replace('{budget}',formData?.budget)  
        .replace('{totalDays}',formData?.noOfDays)

        console.log(FINAL_PROMPT);
        const result=await chatSession.sendMessage(FINAL_PROMPT);
        console.log(result?.response?.text());
    };
    

    return (
        <LoadScript googleMapsApiKey="AIzaSyARGxaUcbKuvSeR9ok_RLJiHedU0xrj2oQ"
            libraries={["places"]}>
            <div>
            <ToastContainer />
                <div
                    className="head"
                    style={{ position: "absolute", top: "50px", left: "10px" }}
                >
                    <h1>Travel Plan ⛺</h1>
                    <p>Give some basic information so that we can generate a trip plan</p>
                </div>

                <div
                    className="destination"
                    style={{ position: "absolute", top: "170px", left: "10px" }}
                >
                    <p>What is your Destination?</p>

                    <GooglePlacesAutocomplete 
                        autocompletionRequest={{ componentRestrictions: { country: "bd" } }}
                        selectProps={{
                            
                            onChange: (v) => {
                                
                               handleInputChange('location',v)
                            }
                        }}
                    />
                </div>

                <div
                    className="time"
                    style={{ position: "absolute", top: "280px", left: "10px" }}
                >
                    <p>How many days are you planning your trip?</p>

                    {/* Dropdown or Input field for the number of days */}
                    <input
                        type="number"
                        
                        onChange={(e) => handleInputChange('noOfDays',e.target.value)}
                        placeholder="Enter number of days"
                        style={{ padding: "5px", fontSize: "16px" }}
                    />
                </div>
                
                <div
    className="budget"
    style={{ position: "absolute", top: "390px", left: "10px" }}
>
    <p>What is your budget?</p>
    <div
        style={{
            display: "flex",
            gap: "20px",
            marginTop: "10px",
            flexWrap: "wrap", // Ensures wrapping if the screen is narrow
        }}
    >
        {SelectBudgetOptions.map((item, index) => (
            <div
                key={index}
                
                onClick={(e) => handleInputChange('budget',item.title)}

                style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "15px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    backgroundColor: "#fff",
                    width: "200px", // Ensures consistent card size
                    transition: "transform 0.3s, box-shadow 0.3s", // Smooth transition for hover effect
                    cursor: "pointer", // Indicates interactivity
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                        "0 8px 16px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(0, 0, 0, 0.1)";
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <h2 style={{ fontSize: "24px", margin: "0" }}>{item.icon}</h2>
                    <h3 style={{ fontSize: "20px", margin: "0" }}>{item.title}</h3>
                </div>
                <p
                    style={{
                        fontSize: "16px",
                        color: "#666",
                        margin: "10px 0 0 0",
                        textAlign: "left",
                    }}
                >
                    {item.desc}
                </p>
            </div>
        ))}
    </div>
</div>
        
<div
    className="budget"
    style={{ position: "absolute", top: "590px", left: "10px" }}
>
    <p>Who do you plan on traveling with your next adventure?</p>
    <div
        style={{
            display: "flex",
            gap: "20px",
            marginTop: "10px",
            flexWrap: "wrap", // Ensures wrapping if the screen is narrow
        }}
    >
        {SelectTravelsList.map((item, index) => (
            <div
                key={index}
                
                onClick={(e) => handleInputChange('traveler',item.people)}

                style={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "15px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    backgroundColor: "#fff",
                    width: "200px", // Ensures consistent card size
                    transition: "transform 0.3s, box-shadow 0.3s", // Smooth transition for hover effect
                    cursor: "pointer", // Indicates interactivity
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                        "0 8px 16px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(0, 0, 0, 0.1)";
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <h2 style={{ fontSize: "24px", margin: "0" }}>{item.icon}</h2>
                    <h3 style={{ fontSize: "20px", margin: "0" }}>{item.title}</h3>
                </div>
                <p
                    style={{
                        fontSize: "16px",
                        color: "#666",
                        margin: "10px 0 0 0",
                        textAlign: "left",
                    }}
                >
                    {item.desc}
                </p>
            </div>
        ))}
    </div>
</div>

      <div className="tripbutton"
      style={{ position: "absolute", top: "790px", left: "10px" }}>
      
    <button onClick={OnGenerateTrip}>Generate Trip </button>

      </div>
          










            </div>
        </LoadScript>
    );
};