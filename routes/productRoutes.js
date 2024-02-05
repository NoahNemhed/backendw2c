// productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Endpoint to create a product
router.post('/createProduct', productController.createProduct);

// Endpoint to get products by category
router.post('/getProductsByCategory', productController.getProductsByCategory);

// Endpoint to get products by category
router.post('/getProductsBySearch', productController.getProductsBySearch);


module.exports = router;