const express = require('express');
const router = express.Router();    
// Import the Menu model from the models directory
const Menu = require('../models/Menu');

// GET method to fetch all menu items
router.get('/', async (req, res) => {
    try {
        const data = await Menu.find(); // Fetch all menu items from the database
        console.log('Menu items fetched successfully:', data);
        // Log the fetched menu items
        if (data.length === 0) {
            return res.status(404).json({ message: 'No menu items found' });
        }
        // Check if no menu items are found
        res.status(200).json(data); // Send the menu items as a JSON response
    }
    catch (err) {
        console.error('Error fetching menu items:', err);
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
});

// POST method to create a new menu item
router.post('/', async (req, res) => {
    try {
        const data = req.body; // assuming data is in the request body
        const newMenuItem = new Menu(data); // create a new menu item document using mongoose model.
        const response = await newMenuItem.save(); // save the new menu item document to the database
        res.status(201).json({ message: 'Menu item created successfully', data: response });
    }
    catch (err) {
        console.error('Error creating menu item:', err);
        res.status(500).json({ error: 'Failed to create menu item' });
    }
})

// PUT method to update a menu item by ID
router.put('/:id', async (req, res) => {
    try {
        const menuId = req.params.id; // get the menu item ID from the request parameters
        const updatedData = req.body; // get the updated data from the request body

        const updatedMenuItem = await Menu.findByIdAndUpdate(menuId, updatedData, { 
            new: true ,
            runValidators: true     
        }); // update the menu item in the database
        
        if (!updatedMenuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        // Check if the menu item was found and updated
        res.status(200).json({ message: 'Menu item updated successfully', data: updatedMenuItem });
    }
    catch (err) {
        console.error('Error updating menu item:', err);
        res.status(500).json({ error: 'Failed to update menu item' });
    }
});

// DELETE method to delete a menu item by ID
router.delete('/:id', async (req, res) => {
    try {
        const menuId = req.params.id; // get the menu item ID from the request parameters

        const deletedMenuItem = await Menu.findByIdAndDelete(menuId); // delete the menu item from the database
        
        if (!deletedMenuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        // Check if the menu item was found and deleted
        res.status(200).json({ message: 'Menu item deleted successfully' });
    }
    catch (err) {
        console.error('Error deleting menu item:', err);
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
});

router.get('/:category'  ,async(req , res)=>{
    try{
        const categoryType = req.params.category; // get the category from the request parameters
        const menuItems = await Menu.find({ category: categoryType }); // find menu items with the specified category
        if(categoryType == "appetizer" || categoryType == "main course" || categoryType == "dessert" || categoryType == "beverage") {
            // Check if the category is valid
            if (menuItems.length === 0) {
                return res.status(404).json({ message: 'No menu items found for this category' });
            }
            // Check if no menu items are found for the specified category
            res.status(200).json(menuItems); // send the menu items as a JSON response
            console.log("Menu items fetched successfully for category:", categoryType);
        }
    }
    catch (err) {
        console.error('Error fetching menu items by category:', err);
        res.status(500).json({ error: 'Failed to fetch menu items by category' });
    }
});

// Export the router to use in the main server file
module.exports = router;