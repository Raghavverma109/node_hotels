const mongoose = require('mongoose');

// Define the schema for a menu item
const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['appetizer', 'main course', 'dessert', 'beverage'],
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    ingredients: {
        type: [String], // Array of strings for ingredients
        required: true
    },
    num_sales: {
        type: Number,
        default: 0 // Default to 0 sales
    },
});

// Create the model from the schema
const MenuItem = mongoose.model('MenuItem', menuItemSchema);
// Export the model 
module.exports = MenuItem;
// This model can be used to create, read, update, and delete menu items in the MongoDB database.