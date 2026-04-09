const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  color: { type: String, required: true },
  icon: { type: String, default: 'category' },
  type: { type: String, enum: ['income', 'expense'], default: 'expense' }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
