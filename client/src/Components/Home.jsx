import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
import Weather from "./Weather"; // Import the Weather component

export const Home = () => {
  const [touristSpots, setSpots] = useState([]);
  const [filteredSpots, setFilteredSpots] = useState([]); // To store filtered spots
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [directions, setDirections] = useState(null);
  const [travelDetails, setTravelDetails] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/getspots")
      .then((response) => {
        setSpots(response.data);
        setFilteredSpots(response.data); // Initialize with all spots
      })
      .catch((err) => console.error(err));
  }, []);

  // Handle search query changes
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = touristSpots.filter((spot) =>
      spot.name.toLowerCase().includes(query)
    );
    setFilteredSpots(filtered);
  };

  const fetchNearbyPlaces = (lat, lng, type) => {
    const radius = 20000; // 20 km
    axios
      .get("http://localhost:3001/api/places", {
        params: {
          location: `${lat},${lng}`,
          radius,
          type, // hotel, restaurant, or resort
        },
      })
      .then((response) => {
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
    setSelectedSpot(spot);
    fetchNearbyPlaces(spot.latitude, spot.longitude, "hotel"); // Default to hotels
  };

  const handleGetDirections = () => {
    if (selectedSpot) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = { lat: latitude, lng: longitude };

          const directionsService = new window.google.maps.DirectionsService();
          const request = {
            origin: userLocation,
            destination: {
              lat: parseFloat(selectedSpot.latitude),
              lng: parseFloat(selectedSpot.longitude),
            },
            travelMode: window.google.maps.TravelMode.DRIVING,
          };

          directionsService.route(request, (result, status) => {
            if (status === "OK") {
              setDirections(result);
              const leg = result.routes[0].legs[0]; // Extract first leg of the route
              setTravelDetails({
                distance: leg.distance.text,
                duration: leg.duration.text,
              });
            } else {
              console.error("Directions request failed due to " + status);
            }
          });
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    } else {
      alert("Please select a tourist spot first.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        overflowY: "auto",
        maxHeight: "90vh",
        marginTop: "30px",
      }}
    >
      <div style={{ textAlign: "center" }}><h2>Tourist Spots</h2></div>

      {/* Search Bar */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            width: "50%",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {filteredSpots.length === 0 ? (
          <p>No tourist spots found.</p>
        ) : (
          filteredSpots.map((spot) => (
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
            <button onClick={handleGetDirections}>Get Directions</button>
          </div>
           
          {travelDetails && (
            <div style={{ marginTop: "10px" }}>
              <p><strong>Distance:</strong> {travelDetails.distance}</p>
              <p><strong>Estimated Time:</strong> {travelDetails.duration}</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ height: "400px", width: "100%" }}>
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
                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            </div>

            {/* Weather Component */}
            <Weather lat={selectedSpot.latitude} lon={selectedSpot.longitude} />
          </div>
        </div>
      )}
    </div>
  );
};