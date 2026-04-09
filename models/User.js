const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  theme: { type: String, default: 'light' },
  currency: { type: String, default: 'INR' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
