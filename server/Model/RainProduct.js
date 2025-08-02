const mongoose = require('mongoose');

const rainProductSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  product_name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: "rain protection"
  },
  price: {
    type: Number,
    required: true,
    min: 0.01
  },
  description: {
    type: String,
    required: true
  },
  material: {
    type: String,
    required: false
  },
  waterproof_rating: {
    type: String, // e.g., "5000mm", "IPX8"
    required: false
  },
  packed_size: {
    type: String,
    required: false
  },
  weight: {
    type: String,
    required: false
  },
  features: {
    type: [String],
    required: false
  },
  colors: {
    type: [String],
    required: false
  },
  sizes: {
    type: [String],
    required: false
  },
  img_url: {
    type: String,
    required: true,
    match: /^(https?:\/\/)/i // Basic URL validation
  },
  canopy_diameter: {
    type: String, // For umbrellas
    required: false
  },
  shaft_length: {
    type: String, // For umbrellas
    required: false
  },
  wind_resistance: {
    type: String, // e.g., "Up to 70 km/h"
    required: false
  },
  capacity: {
    type: String, // e.g., "30-50 liters"
    required: false
  },
  compatibility: {
    type: [String], // e.g., ["Hiking packs", "Travel backpacks"]
    required: false
  },
  height: {
    type: String, // e.g., "Ankle height"
    required: false
  },
  size_unfolded: {
    type: String, // e.g., "140 x 110 cm"
    required: false
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true }, // Include virtuals when converting to JSON
  toObject: { virtuals: true } // Include virtuals when converting to objects
});

// Create index for faster searches
rainProductSchema.index({ product_name: 'text', description: 'text' });

// Virtual for formatted price
rainProductSchema.virtual('formatted_price').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Virtual for primary image
rainProductSchema.virtual('primary_image').get(function() {
  return this.img_url;
});

const RainProduct = mongoose.model('RainProduct', rainProductSchema, 'rain');

module.exports = RainProduct;