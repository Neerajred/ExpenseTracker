const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

// @route   GET /api/transactions
// @desc    Get all transactions for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, error: 'UserId required' });

    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   GET /api/transactions/categories
// @desc    Get expense breakdown by category for a user
router.get('/categories', async (req, res) => {
  try {
    const { month, userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, error: 'UserId required' });

    let matchStage = { 
      userId: new mongoose.Types.ObjectId(userId),
      type: { $regex: /^expense$/i } 
    };

    if (month === 'current') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      matchStage.date = { $gte: startOfMonth };
    }

    const breakdown = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $ifNull: ['$category', 'Others'] },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json({
      success: true,
      data: breakdown
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   GET /api/transactions/summary
// @desc    Get calculated summary directly from DB for a user
router.get('/summary', async (req, res) => {
  try {
    const { month, userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, error: 'UserId required' });

    let matchStage = { userId: new mongoose.Types.ObjectId(userId) };

    if (month === 'current') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      matchStage.date = { $gte: startOfMonth };
    }

    const summary = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { 
              $cond: [
                { $eq: ["$type", "income"] }, 
                "$amount", 
                0
              ] 
            }
          },
          totalExpense: {
            $sum: { 
              $cond: [
                { $eq: ["$type", "expense"] }, 
                "$amount", 
                0
              ] 
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpense: 1,
          balance: { $subtract: ["$totalIncome", "$totalExpense"] }
        }
      }
    ]);

    if (summary.length === 0) {
      return res.json({ success: true, data: { totalIncome: 0, totalExpense: 0, balance: 0 } });
    }

    res.json({
      success: true,
      data: summary[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   GET /api/transactions/filter
// @desc    Get transactions by category and optional month for a user
router.get('/filter', async (req, res) => {
  try {
    const { category, month, userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, error: 'UserId required' });

    let query = { 
      userId,
      type: { $regex: /^expense$/i } 
    };
    
    if (category) {
      if (category === 'Others' || category === 'null') {
        query.category = { $in: [null, 'Others', '', 'General'] };
      } else {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
    }
    
    if (month === 'current') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      query.date = { $gte: startOfMonth };
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/transactions
// @desc    Add new transaction
router.post('/', async (req, res) => {
  try {
    const { userId, title, amount, type, category, date, notes } = req.body;
    if (!userId) return res.status(400).json({ success: false, error: 'UserId required' });

    const transaction = await Transaction.create({
      userId,
      title,
      amount,
      type,
      category,
      date,
      notes
    });

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages });
    } else {
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  }
});

module.exports = router;
