const mongoose = require("mongoose");

const travelPlanSchema = new mongoose.Schema({
  userId: String, // Add userId field
  location: String,
  duration: String,
  travelers: String,
  budget: String,
  hotels: [{
    hotelName: String,
    hotelAddress: String,
    price: String,
    hotelImageUrl: String,
    geoCoordinates: {
      latitude: Number,
      longitude: Number
    },
    rating: String,
    description: String
  }],
  itinerary: [{
    day: Number,
    theme: String,
    plan: [{
      placeName: String,
      placeDetails: String,
      placeImageUrl: String,
      geoCoordinates: {
        latitude: Number,
        longitude: Number
      },
      ticketPricing: String,
      timeToTravel: String,
      bestTimeToVisit: String
    }]
  }]
});

const TravelPlan = mongoose.model('TripPlanModel', travelPlanSchema, 'tripplans');
module.exports = TravelPlan;