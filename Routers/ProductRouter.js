const express=require('express');
const { createProduct, getProduct } = require('../Controllers/ProductController');
const ProductRouter = express.Router();

ProductRouter.post("/CreateProduct",createProduct);
ProductRouter.get("/getProduct",getProduct);
module.exports = ProductRouter;