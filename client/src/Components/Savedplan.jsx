import { useEffect, useState } from "react";
import axios from "axios";
import "./SavedPlan.css";

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
    <div className="saved-plans-container">
      <div className="saved-plans-card">
        <div className="saved-header">
          <h1>Saved Plans 📋</h1>
          <p className="saved-subtitle">Your personalized travel itineraries and adventures</p>
        </div>

        {savedPlans.length === 0 ? (
          <div className="empty-state">
            <h3>No Saved Plans Yet</h3>
            <p>Start creating your travel plans to see them here. Generate your first adventure and it will appear in this list!</p>
          </div>
        ) : (
          <div className="plans-grid">
            {savedPlans.map(plan => (
              <div key={plan._id} className="plan-card" onClick={() => handleOpen(plan)}>
                <div className="plan-header">
                  <div className="plan-location">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    {plan.location}
                  </div>
                  <button 
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(plan._id);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                </div>
                <div className="plan-details">
                  <div className="plan-detail">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                    Duration: {plan.duration} days
                  </div>
                  <div className="plan-detail">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-4.7 6.27c-.41.55-.63 1.24-.59 1.93V22h-6v-2h4v-4h-2.5l-2.54-7.63A1.5 1.5 0 0 0 4.54 8H3c-.8 0-1.54.37-2.01 1L0 15v7h2v-6h2.5l2.04 6.13c.41 1.02 1.37 1.87 2.46 1.87H9c.8 0 1.54-.37 2.01-1l4.7-6.27c.41-.55.63-1.24.59-1.93V6h6v2h-4v4h2.5l2.04 6.13c.41 1.02 1.37 1.87 2.46 1.87H22v-2h-2z"/>
                    </svg>
                    Travelers: {plan.travelers}
                  </div>
                  <div className="plan-detail">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                    </svg>
                    Budget: {plan.budget}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {open && selectedPlan && (
          <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  {selectedPlan.location}
                </div>
                <button className="close-button" onClick={handleClose}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>

              <div className="modal-details">
                <div className="modal-detail">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                  <strong>Duration:</strong> {selectedPlan.duration} days
                </div>
                <div className="modal-detail">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-4.7 6.27c-.41.55-.63 1.24-.59 1.93V22h-6v-2h4v-4h-2.5l-2.54-7.63A1.5 1.5 0 0 0 4.54 8H3c-.8 0-1.54.37-2.01 1L0 15v7h2v-6h2.5l2.04 6.13c.41 1.02 1.37 1.87 2.46 1.87H9c.8 0 1.54-.37 2.01-1l4.7-6.27c.41-.55.63-1.24.59-1.93V6h6v2h-4v4h2.5l2.04 6.13c.41 1.02 1.37 1.87 2.46 1.87H22v-2h-2z"/>
                  </svg>
                  <strong>Travelers:</strong> {selectedPlan.travelers}
                </div>
                <div className="modal-detail">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                  </svg>
                  <strong>Budget:</strong> {selectedPlan.budget}
                </div>
              </div>

              <div className="modal-section">
                <h4>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 13c1.65 0 3-1.35 3-3S8.65 7 7 7s-3 1.35-3 3 1.35 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
                  </svg>
                  Hotels
                </h4>
                <ul className="hotel-list">
                  {selectedPlan.hotels.map((hotel, index) => (
                    <li key={index} className="hotel-item">
                      <strong>{hotel.hotelName}</strong><br />
                      {hotel.hotelAddress} - {hotel.price}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-section">
                <h4>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                  </svg>
                  Itinerary
                </h4>
                <ul className="itinerary-list">
                  {selectedPlan.itinerary.map((day, index) => (
                    <li key={index} className="itinerary-item">
                      <div className="day-item">
                        <div className="day-header">Day {day.day}: {day.theme}</div>
                        <ul className="place-list">
                          {day.plan.map((place, idx) => (
                            <li key={idx} className="place-item">
                              <strong>{place.placeName}</strong> - {place.placeDetails}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
