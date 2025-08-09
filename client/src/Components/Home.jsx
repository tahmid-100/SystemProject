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
    const radius = 5000; // 20 km
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
    // Clear previous travel details and directions
    setTravelDetails(null);
    setDirections(null);
    // Fetch nearby places for the new spot
    fetchNearbyPlaces(spot.latitude, spot.longitude, "hotel");
    
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
    // Clear previous directions and travel details first
    setDirections(null);
    setTravelDetails(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = { lat: latitude, lng: longitude };
        const destination = {
          lat: parseFloat(selectedSpot.latitude),
          lng: parseFloat(selectedSpot.longitude),
        };

        // Enhanced travel modes with priorities
        const travelModes = [
          {
            mode: window.google.maps.TravelMode.DRIVING,
            name: "Driving",
            allowFerries: true
          },
          {
            mode: window.google.maps.TravelMode.TRANSIT,
            name: "Public Transit",
            allowFerries: true
          },
          {
            mode: window.google.maps.TravelMode.WALKING,
            name: "Walking",
            allowFerries: true
          }
        ];

        const directionsService = new window.google.maps.DirectionsService();
        const distanceService = new window.google.maps.DistanceMatrixService();

        // Function to calculate straight-line distance
        const calculateDistance = (lat1, lng1, lat2, lng2) => {
          const R = 6371; // Earth's radius in km
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLng = (lng2 - lng1) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLng/2) * Math.sin(dLng/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          return R * c;
        };

        const straightLineDistance = calculateDistance(
          userLocation.lat, userLocation.lng,
          destination.lat, destination.lng
        );

        // Function to provide water crossing alternatives
        const provideWaterCrossingAlternatives = () => {
          // Check if it's likely a water crossing based on distance
          const isLikelyWaterCrossing = straightLineDistance > 50; // Adjust threshold as needed
          
          const alternativeInfo = {
            type: 'water_crossing',
            straightLineDistance: `${straightLineDistance.toFixed(1)} km`,
            alternatives: []
          };

          // Suggest ferry services
          alternativeInfo.alternatives.push({
            method: 'Ferry Service',
            description: 'Look for ferry services that operate between your location and the destination',
            icon: '⛴️'
          });

          // Suggest flight options for long distances
          if (straightLineDistance > 100) {
            alternativeInfo.alternatives.push({
              method: 'Flight',
              description: 'Consider flying to the nearest airport to your destination',
              icon: '✈️'
            });
          }

          // Suggest alternative routes via land
          alternativeInfo.alternatives.push({
            method: 'Land Route',
            description: 'Try finding a route that goes around the water body via bridges or alternative paths',
            icon: '🌉'
          });

          // Suggest boat/water taxi
          alternativeInfo.alternatives.push({
            method: 'Private Boat/Water Taxi',
            description: 'Look for private boat services or water taxis in the area',
            icon: '🚤'
          });

          return alternativeInfo;
        };

        // Enhanced function to try different travel modes
        const tryNextTravelMode = (index) => {
          if (index >= travelModes.length) {
            // All travel modes failed, provide water crossing alternatives
            const alternatives = provideWaterCrossingAlternatives();
            
            setTravelDetails({
              type: 'no_route_found',
              straightLineDistance: alternatives.straightLineDistance,
              alternatives: alternatives.alternatives,
              message: "No direct route found. This might be due to a water body between locations."
            });
            
            return;
          }

          const currentMode = travelModes[index];
          const request = {
            origin: userLocation,
            destination: destination,
            travelMode: currentMode.mode,
            provideRouteAlternatives: true,
            avoidFerries: !currentMode.allowFerries,
            avoidHighways: false,
            avoidTolls: false,
            unitSystem: window.google.maps.UnitSystem.METRIC
          };

          directionsService.route(request, (result, status) => {
            if (status === "OK") {
              const route = result.routes[0];
              const leg = route.legs[0];
              
              // Check for ferry warnings or water crossings
              const hasWaterCrossing = route.warnings?.some(warning => 
                warning.toLowerCase().includes('ferry') || 
                warning.toLowerCase().includes('water') ||
                warning.toLowerCase().includes('bridge')
              );

              // Check if the route distance is significantly longer than straight-line distance
              const routeDistanceKm = parseFloat(leg.distance.text.replace(/[^\d.]/g, ''));
              const distanceRatio = routeDistanceKm / straightLineDistance;

              setDirections(result);
              setTravelDetails({
                type: 'route_found',
                distance: leg.distance.text,
                duration: leg.duration.text,
                travelMode: currentMode.name,
                straightLineDistance: `${straightLineDistance.toFixed(1)} km`,
                hasWaterCrossing: hasWaterCrossing,
                routeComplexity: distanceRatio > 2 ? 'complex' : 'direct',
                warnings: route.warnings || [],
                ferryInfo: hasWaterCrossing ? "This route may include water crossings or ferries" : null
              });
              
            } else if (status === "ZERO_RESULTS" || status === "NOT_FOUND") {
              // Try next travel mode
              tryNextTravelMode(index + 1);
            } else {
              console.error(`Directions request failed: ${status}`);
              tryNextTravelMode(index + 1);
            }
          });
        };

        // Also try Distance Matrix API for additional information
        distanceService.getDistanceMatrix({
          origins: [userLocation],
          destinations: [destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
          avoidHighways: false,
          avoidTolls: false,
        }, (response, status) => {
          if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
            // Distance Matrix found a route, proceed with directions
            tryNextTravelMode(0);
          } else {
            // Distance Matrix also failed, likely water crossing
            const alternatives = provideWaterCrossingAlternatives();
            setTravelDetails({
              type: 'no_route_found',
              straightLineDistance: alternatives.straightLineDistance,
              alternatives: alternatives.alternatives,
              message: "No land route available. Consider alternative transportation methods."
            });
          }
        });

      }, (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to get your current location. Please enable location services.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  } else {
    alert("Please select a tourist spot first.");
  }
};

  // Add this useEffect after your other useEffects
  useEffect(() => {
    // Clear directions and travel details when selected spot changes
    setDirections(null);
    setTravelDetails(null);
  }, [selectedSpot]);

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
                  background: travelDetails.type === 'no_route_found' ? "#fef2f2" : "#f7fafc", 
                  padding: "20px", 
                  borderRadius: "12px",
                  border: `1px solid ${travelDetails.type === 'no_route_found' ? "#fecaca" : "#e2e8f0"}`,
                  marginBottom: "20px"
                }}>
                  {travelDetails.type === 'route_found' ? (
                    <>
                      <h4 style={{ 
                        fontSize: "1.1rem", 
                        fontWeight: "600", 
                        color: "#2d3748", 
                        marginBottom: "15px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap"
                      }}>
                        🗺️ Travel Information
                        {travelDetails.requiresFerry && (
                          <span style={{
                            fontSize: "0.75rem",
                            backgroundColor: "#3182ce",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "12px"
                          }}>
                            Ferry Required
                          </span>
                        )}
                        {travelDetails.hasBridges && !travelDetails.requiresFerry && (
                          <span style={{
                            fontSize: "0.75rem",
                            backgroundColor: "#48bb78",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "12px"
                          }}>
                            Bridge Crossing
                          </span>
                        )}
                        {travelDetails.routeComplexity === 'complex' && (
                          <span style={{
                            fontSize: "0.75rem",
                            backgroundColor: "#ed8936",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "12px"
                          }}>
                            Long Route
                          </span>
                        )}
                      </h4>
                      
                      <div style={{ 
                        display: "grid", 
                        gridTemplateColumns: "1fr 1fr", 
                        gap: "15px",
                        marginBottom: "10px"
                      }}>
                        <div>
                          <span style={{ fontWeight: "600", color: "#4a5568" }}>Distance:</span>
                          <span style={{ marginLeft: "8px", color: "#667eea" }}>{travelDetails.distance}</span>
                        </div>
                        <div>
                          <span style={{ fontWeight: "600", color: "#4a5568" }}>Duration:</span>
                          <span style={{ marginLeft: "8px", color: "#667eea" }}>{travelDetails.duration}</span>
                        </div>
                        <div>
                          <span style={{ fontWeight: "600", color: "#4a5568" }}>Mode:</span>
                          <span style={{ marginLeft: "8px", color: "#667eea" }}>{travelDetails.travelMode}</span>
                        </div>
                        <div>
                          <span style={{ fontWeight: "600", color: "#4a5568" }}>Straight Line:</span>
                          <span style={{ marginLeft: "8px", color: "#667eea" }}>{travelDetails.straightLineDistance}</span>
                        </div>
                      </div>

                      {/* Ferry Information */}
                      {travelDetails.requiresFerry && (
                        <div style={{
                          backgroundColor: "#e6f3ff",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #b3d9ff",
                          marginTop: "10px"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>⛴️</span>
                            <div>
                              <div style={{ fontWeight: "600", color: "#1a365d", fontSize: "0.9rem" }}>
                                Ferry Required
                              </div>
                              <div style={{ color: "#2c5282", fontSize: "0.85rem", marginTop: "2px" }}>
                                This route requires taking a ferry. Check ferry schedules and costs before traveling.
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bridge Information */}
                      {travelDetails.hasBridges && !travelDetails.requiresFerry && (
                        <div style={{
                          backgroundColor: "#f0fff4",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #9ae6b4",
                          marginTop: "10px"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>🌉</span>
                            <div>
                              <div style={{ fontWeight: "600", color: "#22543d", fontSize: "0.9rem" }}>
                                Route includes bridge crossings
                              </div>
                              <div style={{ color: "#2f855a", fontSize: "0.85rem", marginTop: "2px" }}>
                                Normal road route with bridge crossings over rivers or waterways.
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Complex Route Warning */}
                      {travelDetails.routeComplexity === 'complex' && (
                        <div style={{
                          backgroundColor: "#fff3cd",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #ffeaa7",
                          marginTop: "10px"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>⚠️</span>
                            <div>
                              <div style={{ fontWeight: "600", color: "#856404", fontSize: "0.9rem" }}>
                                Long detour route (×{travelDetails.distanceRatio} straight-line distance)
                              </div>
                              <div style={{ color: "#975a16", fontSize: "0.85rem", marginTop: "2px" }}>
                                {travelDetails.routeNote || "This route involves significant detours around geographical features"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Additional Warnings */}
                      {travelDetails.warnings && travelDetails.warnings.length > 0 && (
                        <div style={{
                          backgroundColor: "#f7fafc",
                          padding: "12px",
                          borderRadius: "8px",
                          border: "1px solid #e2e8f0",
                          marginTop: "10px"
                        }}>
                          <div style={{ fontWeight: "600", color: "#2d3748", fontSize: "0.9rem", marginBottom: "5px" }}>
                            Route Information:
                          </div>
                          {travelDetails.warnings.map((warning, index) => (
                            <div key={index} style={{ 
                              color: "#4a5568", 
                              fontSize: "0.85rem", 
                              marginBottom: "3px",
                              paddingLeft: "8px"
                            }}>
                              • {warning}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <h4 style={{ 
                        fontSize: "1.1rem", 
                        fontWeight: "600", 
                        color: "#dc2626", 
                        marginBottom: "15px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        🚫 No Road Route Available
                      </h4>
                      
                      <p style={{ color: "#4a5568", marginBottom: "15px" }}>
                        {travelDetails.message}
                      </p>
                      
                      <div style={{ marginBottom: "15px" }}>
                        <span style={{ fontWeight: "600", color: "#4a5568" }}>Straight-line distance:</span>
                        <span style={{ marginLeft: "8px", color: "#667eea" }}>{travelDetails.straightLineDistance}</span>
                      </div>

                      <div>
                        <h5 style={{ 
                          fontWeight: "600", 
                          color: "#2d3748", 
                          marginBottom: "10px" 
                        }}>
                          Alternative Transportation Options:
                        </h5>
                        
                        {travelDetails.alternatives.map((alternative, index) => (
                          <div key={index} style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                            padding: "12px",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            marginBottom: "8px"
                          }}>
                            <span style={{ fontSize: "1.2rem" }}>{alternative.icon}</span>
                            <div>
                              <div style={{ fontWeight: "600", color: "#2d3748" }}>
                                {alternative.method}
                              </div>
                              <div style={{ fontSize: "0.9rem", color: "#4a5568", marginTop: "2px" }}>
                                {alternative.description}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{
                        backgroundColor: "#e6f3ff",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #b3d9ff",
                        marginTop: "15px"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>💡</span>
                          <span style={{ color: "#1a365d", fontSize: "0.9rem", fontWeight: "500" }}>
                            Tip: Contact local travel agencies or tourism offices for the best transportation options to reach this destination.
                          </span>
                        </div>
                      </div>
                    </>
                  )}
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