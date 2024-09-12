const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now, // No parentheses here
    },
    active: {
        type: Boolean,
        default: true,
    },
    name: {
        type: String,
        required: [true, "Please provide a valid name"],
    },
    price: {
        type: Number,
        required: [true, "Please provide a valid price"],
        min: 0,
    },
    rating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must be at most 5"],
        default: 3,
    },
    brand: {
        type: String,
        required: [true, 'Please provide a valid brand'],
    },
    catagory: {
        type: String,
        enum: ["hoodies", "trowser", "shirt", "tshirt", "denim"],
        required: [true, "Please provide a valid catagory"],
    },
    gender: {
        type: String,
        enum: ["male", "female", "unisex", ""],
        required: [true, "Please provide a valid gender"],
    },
    stock: {
        type: Number,
        required: [true, "Please provide a valid stock"],
        min: 0,
    },
    discount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
});

const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;
