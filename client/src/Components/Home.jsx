import { useEffect, useState } from "react";
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
    
    // Smooth scroll to map section
    setTimeout(() => {
      const mapSection = document.getElementById('map-section');
      if (mapSection) {
        mapSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
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
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onClick={() => handleImageClick(spot)}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-5px)";
                e.target.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
              }}
            >
              <img
                src={spot.imageUrl}
                alt={spot.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
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
        <div id="map-section" style={{ paddingTop: "120px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "flex-start",
            marginBottom: "30px",
            gap: "40px"
          }}>
            <div style={{ 
              width: "50%", 
              height: "500px",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e2e8f0"
            }}>
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
            
            <div style={{ flex: "1" }}>
              <h2 style={{ 
                fontSize: "2.5rem", 
                fontWeight: "700", 
                color: "#2d3748", 
                marginBottom: "15px" 
              }}>
                {selectedSpot.name}
              </h2>
              <p style={{ 
                fontSize: "1.1rem", 
                color: "#4a5568", 
                lineHeight: "1.6",
                marginBottom: "25px"
              }}>
                {selectedSpot.description}
              </p>
              
              <div style={{ 
                display: "flex", 
                flexDirection: "column",
                flexWrap: "wrap", 
                gap: "12px",
                marginBottom: "20px"
              }}>
                <button
                  onClick={() =>
                    fetchNearbyPlaces(
                      selectedSpot.latitude,
                      selectedSpot.longitude,
                      "hotel"
                    )
                  }
                  style={{
                    padding: "12px 20px",
                    backgroundColor: "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#5a67d8";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#667eea";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 8px rgba(102, 126, 234, 0.3)";
                  }}
                >
                  🏨 Hotels
                </button>
                <button
                  onClick={() =>
                    fetchNearbyPlaces(
                      selectedSpot.latitude,
                      selectedSpot.longitude,
                      "restaurant"
                    )
                  }
                  style={{
                    padding: "12px 20px",
                    backgroundColor: "#48bb78",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(72, 187, 120, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#38a169";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(72, 187, 120, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#48bb78";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 8px rgba(72, 187, 120, 0.3)";
                  }}
                >
                  🍽️ Restaurants
                </button>
                <button
                  onClick={() =>
                    fetchNearbyPlaces(
                      selectedSpot.latitude,
                      selectedSpot.longitude,
                      "resort"
                    )
                  }
                  style={{
                    padding: "12px 20px",
                    backgroundColor: "#ed8936",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(237, 137, 54, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#dd6b20";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(237, 137, 54, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#ed8936";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 8px rgba(237, 137, 54, 0.3)";
                  }}
                >
                  🏖️ Resorts
                </button>
                <button 
                  onClick={handleGetDirections}
                  style={{
                    padding: "12px 20px",
                    backgroundColor: "#e53e3e",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(229, 62, 62, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#c53030";
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(229, 62, 62, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#e53e3e";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 8px rgba(229, 62, 62, 0.3)";
                  }}
                >
                  🗺️ Get Directions
                </button>
              </div>
              
              {travelDetails && (
                <div style={{ 
                  background: "#f7fafc", 
                  padding: "20px", 
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  marginBottom: "20px"
                }}>
                  <h4 style={{ 
                    fontSize: "1.1rem", 
                    fontWeight: "600", 
                    color: "#2d3748", 
                    marginBottom: "10px" 
                  }}>
                    Travel Information
                  </h4>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <div>
                      <span style={{ fontWeight: "600", color: "#4a5568" }}>Distance:</span>
                      <span style={{ marginLeft: "8px", color: "#667eea" }}>{travelDetails.distance}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: "600", color: "#4a5568" }}>Duration:</span>
                      <span style={{ marginLeft: "8px", color: "#667eea" }}>{travelDetails.duration}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Weather Component */}
          <div style={{ 
            background: "white", 
            padding: "30px", 
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            border: "1px solid #e2e8f0"
          }}>
            <Weather lat={selectedSpot.latitude} lon={selectedSpot.longitude} />
          </div>
        </div>
      )}
    </div>
  );
};