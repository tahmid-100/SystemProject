const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const UserSchema = new mongoose.Schema({
    uniqueid: { 
        type: String, 
        default: uuidv4, // Automatically generate a unique ID
        unique: true,    // Ensure it's unique in the collection
        index: true      // Make it the primary key by indexing it
    },
    name: String,
    email: { type: String, unique: true },
    password: String,
    phonenum: { type: String, default: null },
    address: { type: String, default: null },
    image: { type: String, default: null }
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;