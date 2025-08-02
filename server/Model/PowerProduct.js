// models/PowerProduct.js
const mongoose = require('mongoose');

const powerProductSchema = new mongoose.Schema({
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
    default: "power"
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  battery_capacity: {
    type: String,
    required: false // Only required for certain power bank products
  },
  usb_ports: {
    type: Number,
    required: false
  },
  usb_c_ports: {
    type: Number,
    required: false
  },
  weight: {
    type: String,
    required: false
  },
  dimensions: {
    type: String,
    required: false
  },
  colors: {
    type: [String],
    required: false
  },
  img_url: {
    type: String,
    required: true
  },
  voltage_range: {
    type: String,
    required: false // For travel adapters
  },
  plug_types: {
    type: [String],
    required: false // For travel adapters
  },
  features: {
    type: [String],
    required: false
  },
  solar_output: {
    type: String,
    required: false // For solar chargers
  },
  charge_time: {
    type: String,
    required: false
  },
  water_resistance: {
    type: String,
    required: false
  },
  output: {
    type: String,
    required: false // For chargers with specific output
  },
  ports: {
    type: [String],
    required: false
  },
  cable_included: {
    type: Boolean,
    required: false
  },
  waterproof_rating: {
    type: String,
    required: false
  },
  temperature_range: {
    type: String,
    required: false
  },
  wireless_output: {
    type: String,
    required: false // For wireless chargers
  },
  wired_output: {
    type: String,
    required: false
  },
  device_capacity: {
    type: String,
    required: false
  },
  compatibility: {
    type: [String],
    required: false
  },
  laptop_compatibility: {
    type: [String],
    required: false // For laptop power banks
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create index for faster searches
powerProductSchema.index({ product_name: 'text', description: 'text' });

const PowerProduct = mongoose.model('PowerProduct', powerProductSchema,'power');

module.exports = PowerProduct;