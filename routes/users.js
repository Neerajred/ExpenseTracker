const express = require('express');
const router = express.Router();
const User = require('../models/User');

const Category = require('../models/Category');

// @route   GET /api/users/:email
// @desc    Get user by email (simple auth sim)
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/users/login
// @desc    Login or Signup with email
router.post('/login', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email required' });

    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Signup: create new user
      user = await User.create({
        name: name || 'New Architect',
        email: email.toLowerCase(),
        theme: 'light',
        currency: 'INR'
      });

      // SEED DEFAULT CATEGORIES FOR NEW USER
      const defaultCategories = [
        { name: 'Salary', color: '#2ECC71', type: 'income', icon: 'account-balance-wallet' },
        { name: 'Food', color: '#FF9F43', type: 'expense', icon: 'restaurant' },
        { name: 'Fuel', color: '#FF5E5E', type: 'expense', icon: 'local-gas-station' },
        { name: 'Shopping', color: '#54A0FF', type: 'expense', icon: 'shopping-basket' },
        { name: 'Groceries', color: '#10AC84', type: 'expense', icon: 'shopping-cart' },
        { name: 'Travelling', color: '#00D2D3', type: 'expense', icon: 'flight' },
        { name: 'Entertainment', color: '#5F27CD', type: 'expense', icon: 'movie' },
        { name: 'Health', color: '#EE5253', type: 'expense', icon: 'medical-services' },
        { name: 'Sent to Friend', color: '#5F27CD', type: 'expense', icon: 'person' },
        { name: 'Received from Friend', color: '#2ECC71', type: 'income', icon: 'person-add' },
        { name: 'Others', color: '#8395A7', type: 'expense', icon: 'more-horiz' }
      ];
      
      await Category.insertMany(defaultCategories.map(c => ({ ...c, userId: user._id })));
      console.log(`Seeded default categories for new user: ${email}`);
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user settings
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;
