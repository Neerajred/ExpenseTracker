const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: [true, 'Please add a text title']
  },
  amount: {
    type: Number,
    required: [true, 'Please add a positive or negative number']
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  },
  friendName: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
