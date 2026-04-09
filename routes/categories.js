const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// @route   GET /api/categories
// @desc    Get all categories for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    console.log('Fetching categories for userId:', userId);
    
    let query = {};
    if (userId) {
      query.userId = userId;
    }
    
    const categories = await Category.find(query);
    console.log(`Found ${categories.length} categories`);
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/categories
// @desc    Add new custom category
router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update a category
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ success: false, error: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;
