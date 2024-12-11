const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const UserModel = require("./Model/User");
const TouristSpotModel = require("./Model/TouristSpot");
const multer = require("multer");
const path = require("path");
const axios = require("axios");

const jwt = require("jsonwebtoken");
const router = express.Router();


dotenv.config();
const app = express();
app.use(express.json());

 app.use(cors())
 app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


 

app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });


    // Set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Store images in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to the file name
    }
});

const upload = multer({ storage });


   


    app.post("/signup", async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "Email already exists" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({ name, email, password: hashedPassword });
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });


    app.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await UserModel.findOne({ email });
            if (user) {
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (passwordMatch) {
                    
                    res.json({ message: "Success", user });
                } else {
                    res.status(401).json("Password doesn't match");
                }
            } else {
                res.status(404).json("No Records found");
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });



    app.get("/user/:userId", async (req, res) => {
        try {
            const user = await UserModel.findById(req.params.userId); // Find the user by ID
            if (user) {
                res.json(user); // Return the user data
            } else {
                res.status(404).json("User not found");
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });


    app.get("/api/places", async (req, res) => {
        const { location, radius, type } = req.query;
      
        const apiKey = "AIzaSyBKA2-Q6ygjD_TfZdNL8g8PpPTWjhdgFzo"; // Replace with your actual API key
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`;
      
        try {
          const response = await axios.get(url);
          res.json(response.data); // Forward the response data to the client
        } catch (error) {
          console.error("Error fetching Places API data:", error.message);
          res.status(500).json({ error: "Failed to fetch data from Places API" });
        }
      });


    app.put("/user/update/:userId", upload.single("image"), async (req, res) => {
        try {
            const { name, phonenum, address } = req.body;
            const image = req.file ? req.file.filename : null; // Get the uploaded image filename
    
            // Find the user and update their details
            const updatedUser = await UserModel.findByIdAndUpdate(
                req.params.userId,
                { name, phonenum, address, image },
                { new: true }
            );
    
            if (updatedUser) {
                res.json(updatedUser); // Return updated user data with the image URL
            } else {
                res.status(404).json("User not found");
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
    
    




    
    
    
    

  


   

    TouristSpotModel.init()
    .then(() => console.log("Mongoose model synced with database"))
    .catch(err => console.error("Error syncing model:", err));

    app.get("/getspots", async (req, res) => {
        try {
          console.log("Fetching tourist spots...");
          const touristSpots = await TouristSpotModel.find();
          console.log("Tourist spots retrieved:", touristSpots); // Log fetched data
          res.status(200).json(touristSpots);
        } catch (err) {
          console.error("Error fetching spots:", err);
          res.status(500).json({ error: err.message });
        }
      });
      