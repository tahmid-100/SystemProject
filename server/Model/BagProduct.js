const mongoose = require('mongoose');

const bagProductSchema = new mongoose.Schema({
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
    default: "bags and accessories"
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
  category: {
    type: String,
    required: true,
    enum: ["backpack", "luggage", "packing organizers", "sling bag", "toiletry bag", "duffel bag", "travel wallet", "bag organizer"]
  },
  capacity: {
    type: String,
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
  features: {
    type: [String],
    required: false
  },
  colors: {
    type: [String],
    required: false
  },
  img_url: {
    type: String,
    required: true,
    match: /^(https?:\/\/)/i
  },
  set_includes: {
    type: [String],
    required: false
  },
  material: {
    type: String,
    required: false
  },
  card_capacity: {
    type: String, // e.g., "8 cards"
    required: false
  },
  compatibility: {
    type: String, // e.g., "Fits most 20-30L backpacks"
    required: false
  },
  interior_dimensions: {
    type: String,
    required: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create index for faster searches
bagProductSchema.index({ 
  product_name: 'text', 
  description: 'text',
  category: 1
});

// Virtual for formatted price
bagProductSchema.virtual('formatted_price').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Virtual for size information
bagProductSchema.virtual('size_info').get(function() {
  if (this.capacity && this.dimensions) {
    return `${this.capacity} • ${this.dimensions}`;
  }
  return this.capacity || this.dimensions || '';
});

// Virtual for primary image
bagProductSchema.virtual('primary_image').get(function() {
  return this.img_url;
});

const BagProduct = mongoose.model('BagProduct', bagProductSchema, 'bag');

module.exports = BagProduct;