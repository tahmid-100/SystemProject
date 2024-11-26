const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const UserModel = require("./Model/User");
const TouristSpotModel = require("./Model/TouristSpot");


dotenv.config();
const app = express();
app.use(express.json());

 app.use(cors())



mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


 

app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });


   


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
                    
                    res.json("Success");
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
      