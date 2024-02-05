// Import required modules and controllers
const express = require("express");
const { createProduct, getProductsByCategory, getProductsBySearch } = require('./controllers/productController');
const cors = require('cors'); // Middleware for enabling CORS
const helmet = require("helmet"); // Middleware for enhancing security

// Initialize Express application
const app = express();
const port = 3000;

// Use middleware to parse JSON and handle CORS headers
app.use(express.json());
app.use(cors());
app.use(helmet());

// Route to create a new product, expects a POST request with product data
app.post('/createProduct', createProduct);

// Route to get all products by category, expects a GET request with category parameters
app.get('/getProductsByCategory', getProductsByCategory);

// Route to get products by search, expects a GET request with search parameters
app.get('/getProductsBySearch', getProductsBySearch);

// Start the Express application and listen on specified port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
