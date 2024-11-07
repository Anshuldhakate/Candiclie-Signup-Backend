const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, unique: true, sparse: true }, // Sparse allows multiple empty fields
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google users
  profilePicture: { type: String }, // Store profile picture URL for Google users
  purpose: { type: String, required: true },
  location: { type: String },
  comments: { type: String },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
