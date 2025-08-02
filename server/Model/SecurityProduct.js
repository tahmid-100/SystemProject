const mongoose = require('mongoose');

const securityProductSchema = new mongoose.Schema({
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
    default: "security"
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
  features: {
    type: [String],
    required: false
  },
  capacity: {
    type: String, // e.g., "3L"
    required: false
  },
  colors: {
    type: [String],
    required: false
  },
  security_level: {
    type: String, // e.g., "Level 3"
    required: false
  },
  img_url: {
    type: String,
    required: true,
    match: /^(https?:\/\/)/i // Basic URL validation
  },
  lock_type: {
    type: String, // e.g., "Combination"
    required: false
  },
  set_includes: {
    type: Number, // e.g., 2
    required: false
  },
  sound_level: {
    type: String, // e.g., "130dB"
    required: false
  },
  activation: {
    type: String, // e.g., "Pull-pin or button"
    required: false
  },
  battery_life: {
    type: String, // e.g., "30 days standby"
    required: false
  },
  cable_length: {
    type: String, // e.g., "1.8m"
    required: false
  },
  compatibility: {
    type: String, // e.g., "All laptops with security slot"
    required: false
  },
  alarm_trigger: {
    type: String, // e.g., "Movement or cable cut"
    required: false
  },
  max_door_gap: {
    type: String, // e.g., "3-8 cm"
    required: false
  },
  max_waist: {
    type: String, // e.g., "48 inches"
    required: false
  },
  water_resistance: {
    type: String, // e.g., "Splash-proof"
    required: false
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true }, // Include virtuals when converting to JSON
  toObject: { virtuals: true } // Include virtuals when converting to objects
});

// Create index for faster searches
securityProductSchema.index({ product_name: 'text', description: 'text' });

// Virtual for formatted price
securityProductSchema.virtual('formatted_price').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Virtual for primary image (handles duplicate img_url field in some entries)
securityProductSchema.virtual('primary_image').get(function() {
  if (Array.isArray(this.img_url)) {
    return this.img_url[0];
  }
  return this.img_url;
});

const SecurityProduct = mongoose.model('SecurityProduct', securityProductSchema, 'security');

module.exports = SecurityProduct;