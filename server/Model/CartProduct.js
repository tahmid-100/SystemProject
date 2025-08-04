const mongoose = require('mongoose');

const cartProductSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    products: [{
        productId: {
            type: String, // Changed to String to handle product IDs like "pwr-1006"
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ''
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: 1
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update the updatedAt field before saving
cartProductSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const CartProduct = mongoose.model('CartProduct', cartProductSchema, 'cart');

module.exports = CartProduct;