const mongoose = require('mongoose');

const sleepProductSchema = new mongoose.Schema({
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
    default: "sleep"
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  material: {
    type: String,
    required: false
  },
  features: {
    type: [String],
    required: false
  },
  dimensions: {
    type: String,
    required: false
  },
  weight: {
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
  case_included: {
    type: Boolean,
    required: false
  },
  inflated_size: {
    type: String,
    required: false
  },
  packed_size: {
    type: String,
    required: false
  },
  battery_life: {
    type: String,
    required: false
  },
  set_up_time: {
    type: String,
    required: false
  },
  care_instructions: {
    type: String,
    required: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create index for faster searches
sleepProductSchema.index({ product_name: 'text', description: 'text' });

const SleepProduct = mongoose.model('SleepProduct', sleepProductSchema, 'sleep');

module.exports = SleepProduct;