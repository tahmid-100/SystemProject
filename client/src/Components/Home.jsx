import React, { useEffect, useState } from "react";
import axios from "axios";
import { LoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

export const Home = () => {
  const [touristSpots, setSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/getspots")
      .then((touristSpots) => setSpots(touristSpots.data))
      .catch((err) => console.error(err));
  }, []);

  const fetchNearbyPlaces = (lat, lng, type) => {
    const radius = 5000; // 5 km
    axios
      .get("http://localhost:3001/api/places", {
        params: {
          location: `${lat},${lng}`,
          radius,
          type, // hotel, restaurant, or resort
        },
      })
      .then((response) => {
        console.log("Places API Response:", response.data); // Log the entire response
        const places = response.data.results.map((place) => ({
          id: place.place_id,
          name: place.name,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          address: place.vicinity,
        }));
        setNearbyPlaces(places);
      })
      .catch((error) => console.error("Error fetching places:", error));
  };
  

  const handleImageClick = (spot) => {
    console.log("Selected Spot:", spot);
    setSelectedSpot(spot);
    fetchNearbyPlaces(spot.latitude, spot.longitude, "hotel"); // Default to hotels
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        overflowY: "auto",
        maxHeight: "100vh",
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
                  cursor: "pointer",
                }}
                onClick={() => handleImageClick(spot)}
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

      {selectedSpot && (
        <div style={{ marginTop: "20px" }}>
          <h2>{selectedSpot.name}</h2>
          <p>{selectedSpot.description}</p>
          <div style={{ margin: "10px 0" }}>
            <button
              onClick={() =>
                fetchNearbyPlaces(
                  selectedSpot.latitude,
                  selectedSpot.longitude,
                  "hotel"
                )
              }
            >
              Show Hotels
            </button>
            <button
              onClick={() =>
                fetchNearbyPlaces(
                  selectedSpot.latitude,
                  selectedSpot.longitude,
                  "restaurant"
                )
              }
            >
              Show Restaurants
            </button>
            <button
              onClick={() =>
                fetchNearbyPlaces(
                  selectedSpot.latitude,
                  selectedSpot.longitude,
                  "resort"
                )
              }
            >
              Show Resorts
            </button>
          </div>
          <div style={{ height: "400px", width: "100%" }}>
            <LoadScript googleMapsApiKey="AIzaSyARGxaUcbKuvSeR9ok_RLJiHedU0xrj2oQ">
              <GoogleMap
                center={{
                  lat: parseFloat(selectedSpot.latitude),
                  lng: parseFloat(selectedSpot.longitude),
                }}
                zoom={12}
                mapContainerStyle={{ width: "100%", height: "100%" }}
              >
                <Marker
                  position={{
                    lat: parseFloat(selectedSpot.latitude),
                    lng: parseFloat(selectedSpot.longitude),
                  }}
                />
                {nearbyPlaces.map((place) => (
                  <Marker
                  key={place.id}
                  position={{ lat: place.lat, lng: place.lng }}
                  title={place.name}
                  onClick={() => setSelectedPlace(place)}
                />
                ))}
                {selectedPlace && (
                  <InfoWindow
                    position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                    onCloseClick={() => setSelectedPlace(null)}
                  >
                    <div>
                      <h3>{selectedPlace.name}</h3>
                      <p>{selectedPlace.address}</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      )}
    </div>
  );
};
