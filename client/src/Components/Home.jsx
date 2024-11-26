import React, { useEffect, useState } from "react";
import axios from "axios";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

export const Home = () => {
  const [touristSpots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/getspots")
      .then((touristSpots) => setSpots(touristSpots.data))
      .catch((err) => console.error(err));
  }, []);

  const handleImageClick = (spot) => {
    console.log(spot); // Check if spot data is correct
    setSelectedSpot(spot); // Set the selected spot data
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        overflowY: "auto", // Allow scrolling if content exceeds viewport
        maxHeight: "100vh", // Limit height to viewport height
      }}
    >
      <h1>Tourist Spots</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {touristSpots.length === 0 ? (
          <p>Loading tourist spots...</p>
        ) : (
          touristSpots.map((spot) => (
            <div
              key={spot._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                maxWidth: "300px",
                textAlign: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={spot.imageUrl}
                alt={spot.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  cursor: "pointer", // Make image look clickable
                }}
                onClick={() => handleImageClick(spot)} // Set the selected spot on click
              />
              <div style={{ padding: "10px" }}>
                <h2 style={{ fontSize: "18px", margin: "10px 0" }}>{spot.name}</h2>
                <p style={{ fontSize: "14px", color: "#555" }}>
                  {spot.description}
                </p>
                <p style={{ fontSize: "12px", color: "#888" }}>
                  Latitude: {spot.latitude}, Longitude: {spot.longitude}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Display Google Map when a spot is selected */}
      {selectedSpot && (
        <div style={{ marginTop: "20px" }}>
          <h2>{selectedSpot.name}</h2>
          <p>{selectedSpot.description}</p>
          <div style={{ height: "400px", width: "100%" }}>
            <LoadScript googleMapsApiKey="AIzaSyBKA2-Q6ygjD_TfZdNL8g8PpPTWjhdgFzo">
              <GoogleMap
                center={{
                  lat: selectedSpot.latitude,
                  lng: selectedSpot.longitude,
                }}
                zoom={12}
                mapContainerStyle={{ width: "100%", height: "100%" }}
              >
                <Marker
                  position={{
                    lat: selectedSpot.latitude,
                    lng: selectedSpot.longitude,
                  }}
                />
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      )}
    </div>
  );
};
