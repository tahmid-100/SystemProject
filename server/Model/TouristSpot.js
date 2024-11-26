const mongoose = require('mongoose');

const touristSpotSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
  latitude: Number,
  longitude: Number,
});

const TouristSpotModel = mongoose.model('TouristSpot', touristSpotSchema, 'touristspot');//explicitly declared

module.exports =TouristSpotModel ;