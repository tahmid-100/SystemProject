const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const UserModel = require("./Model/User");
const TouristSpotModel = require("./Model/TouristSpot");
const TravelPlan = require("./Model/TripPlanModel");
const PowerProduct=require("./Model/PowerProduct");
const SleepProduct = require('./Model/SleepProduct'); 
const BagProduct = require('./Model/BagProduct'); 
const RainProduct = require('./Model/RainProduct');
const SecurityProduct = require('./Model/SecurityProduct'); 
const CartProduct = require('./Model/CartProduct');



const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");

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

    app.post("/saveTravelPlan", async (req, res) => {
        try {
            const travelPlan = new TravelPlan(req.body);
            const savedPlan = await travelPlan.save();
            res.status(201).json(savedPlan);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });


    const touristSpots = require('./Json/list.json').touristSpots;

 
    








     
    app.get("/getTravelPlans/:userId", async (req, res) => {
        try {
            const { userId } = req.params;
            const travelPlans = await TravelPlan.find({ userId });
            res.status(200).json(travelPlans);
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
      
        const apiKey = "AIzaSyARGxaUcbKuvSeR9ok_RLJiHedU0xrj2oQ"; // Replace with your actual API key
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`;
      
        try {
          const response = await axios.get(url);
          res.json(response.data); // Forward the response data to the client
        } catch (error) {
          console.error("Error fetching Places API data:", error.message);
          res.status(500).json({ error: "Failed to fetch data from Places API" });
        }
      });


      app.get("/api/distance", async (req, res) => {

        const { originLat, originLng, destLat, destLng } = req.query;

        // Log received parameters
        console.log("Received Parameters:", { originLat, originLng, destLat, destLng });
      
        // Validate parameters
        if (!originLat || !originLng || !destLat || !destLng) {
          return res.status(400).json({ error: "Missing or invalid parameters" });
        }

      
        // Log received parameters for debugging
        console.log("Received Parameters:", { originLat, originLng, destLat, destLng });
      
        // Validate parameters
        if (!originLat || !originLng || !destLat || !destLng) {
          return res.status(400).json({ error: "Missing or invalid parameters" });
        }
      
        try {
          const origin = `${originLat},${originLng}`;
          const destination = `${destLat},${destLng}`;
          const apiKey = "AIzaSyARGxaUcbKuvSeR9ok_RLJiHedU0xrj2oQ";
      
          const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${apiKey}`;
          const response = await axios.get(url);
      
          if (response.data.status === "OK") {
            const distance = response.data.rows[0].elements[0].distance.text;
            const duration = response.data.rows[0].elements[0].duration.text;
            return res.json({ distance, duration });
          } else {
            console.error("Google API Error:", response.data.error_message || response.data);
            return res.status(500).json({ error: "Failed to fetch distance from Google API" });
          }
        } catch (error) {
          console.error("Error fetching distance:", error.message);
          return res.status(500).send("Failed to fetch distance");
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
    

    app.delete('/deleteTravelPlan/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await TravelPlan.findByIdAndDelete(id);
            res.status(200).json({ message: "Plan deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting plan", error });
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



    

 // Backend route to get power products
app.get("/api/products/power", async (req, res) => {
  console.log("GET /api/products/power requested");
  try {
    const powerProducts = await PowerProduct.find();
    console.log(`Found ${powerProducts.length} products`);
    res.status(200).json(powerProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/products/sleep", async (req, res) => {
  console.log("GET /api/products/sleep requested");
  try {
    const sleepProducts = await SleepProduct.find();
    console.log(`Found ${sleepProducts.length} sleep products`);
    res.status(200).json(sleepProducts);
  } catch (error) {
    console.error("Error fetching sleep products:", error);
    res.status(500).json({ error: error.message });
  }
});

// Security Products Endpoint
app.get("/api/products/security", async (req, res) => {
  console.log("GET /api/products/security requested");
  try {
   
    const securityProducts = await SecurityProduct.find();
    console.log(`Found ${securityProducts.length} security products`);
    res.status(200).json(securityProducts);
  } catch (error) {
    console.error("Error fetching security products:", error);
    res.status(500).json({ error: error.message });
  }
});

// Bags Products Endpoint
app.get("/api/products/bags", async (req, res) => {
  console.log("GET /api/products/bags requested");
  try {
   
    const bagProducts = await BagProduct.find();
    console.log(`Found ${bagProducts.length} bag products`);
    res.status(200).json(bagProducts);
  } catch (error) {
    console.error("Error fetching bag products:", error);
    res.status(500).json({ error: error.message });
  }
});

// Rain Protection Products Endpoint
app.get("/api/products/rain", async (req, res) => {
  console.log("GET /api/products/rain requested");
  try {
  
    const rainProducts = await RainProduct.find();
    console.log(`Found ${rainProducts.length} rain products`);
    res.status(200).json(rainProducts);
  } catch (error) {
    console.error("Error fetching rain products:", error);
    res.status(500).json({ error: error.message });
  }
});


// Add product to cart
app.post("/api/cart/add", async (req, res) => {
    try {
        const { userId, product } = req.body;
        
        if (!userId || !product) {
            return res.status(400).json({ error: "UserId and product are required" });
        }

        // Check if user already has a cart
        let userCart = await CartProduct.findOne({ userId });
        
        if (userCart) {
            // Check if product already exists in cart
            const existingProductIndex = userCart.products.findIndex(
                p => p.productId.toString() === product.id.toString()
            );
            
            if (existingProductIndex > -1) {
                // Product exists, increment quantity
                userCart.products[existingProductIndex].quantity += 1;
            } else {
                // Product doesn't exist, add new product
                userCart.products.push({
                    productId: product.id,
                    name: product.name,
                    price: parseFloat(product.price.replace('$', '')),
                    image: product.image,
                    description: product.description || '',
                    quantity: 1
                });
            }
            
            userCart.updatedAt = new Date();
            await userCart.save();
        } else {
            // Create new cart for user
            userCart = new CartProduct({
                userId,
                products: [{
                    productId: product.id,
                    name: product.name,
                    price: parseFloat(product.price.replace('$', '')),
                    image: product.image,
                    description: product.description || '',
                    quantity: 1
                }]
            });
            
            await userCart.save();
        }
        
        res.status(200).json({ 
            message: "Product added to cart successfully", 
            cart: userCart 
        });
        
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get user's cart
app.get("/api/cart/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        const userCart = await CartProduct.findOne({ userId });
        
        if (!userCart) {
            return res.status(200).json({ 
                products: [], 
                totalItems: 0, 
                totalPrice: 0 
            });
        }
        
        // Calculate totals
        const totalItems = userCart.products.reduce((sum, product) => sum + product.quantity, 0);
        const totalPrice = userCart.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        
        res.status(200).json({
            products: userCart.products,
            totalItems,
            totalPrice: totalPrice.toFixed(2),
            createdAt: userCart.createdAt,
            updatedAt: userCart.updatedAt
        });
        
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ error: error.message });
    }
});

// Update product quantity in cart
app.put("/api/cart/update", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        
        if (!userId || !productId || quantity < 1) {
            return res.status(400).json({ error: "Invalid parameters" });
        }
        
        const userCart = await CartProduct.findOne({ userId });
        
        if (!userCart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        
        const productIndex = userCart.products.findIndex(
            p => p.productId.toString() === productId.toString()
        );
        
        if (productIndex === -1) {
            return res.status(404).json({ error: "Product not found in cart" });
        }
        
        userCart.products[productIndex].quantity = quantity;
        userCart.updatedAt = new Date();
        
        await userCart.save();
        
        res.status(200).json({ 
            message: "Cart updated successfully", 
            cart: userCart 
        });
        
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ error: error.message });
    }
});

// Remove product from cart
app.delete("/api/cart/remove", async (req, res) => {
    try {
        const { userId, productId } = req.body;
        
        if (!userId || !productId) {
            return res.status(400).json({ error: "UserId and productId are required" });
        }
        
        const userCart = await CartProduct.findOne({ userId });
        
        if (!userCart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        
        userCart.products = userCart.products.filter(
            p => p.productId.toString() !== productId.toString()
        );
        
        userCart.updatedAt = new Date();
        
        await userCart.save();
        
        res.status(200).json({ 
            message: "Product removed from cart successfully", 
            cart: userCart 
        });
        
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({ error: error.message });
    }
});

// Clear entire cart
app.delete("/api/cart/clear/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        await CartProduct.findOneAndDelete({ userId });
        
        res.status(200).json({ message: "Cart cleared successfully" });
        
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ error: error.message });
    }
});

const paymentRoutes = require('./Routes/paymentRoutes');

// Add this after your existing middleware
app.use('/api/payment', paymentRoutes);






















