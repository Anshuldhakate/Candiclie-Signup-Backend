// routes/auth.js
const express = require('express');
const User = require('../models.js/User');
const bcrypt = require('bcryptjs');
const router = express.Router();


router.post('/register', async (req, res) => {
  const { firstName, lastName, phone, email, password, purpose, location, comments } = req.body;

  try {

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });


    const newUser = new User({ firstName, lastName, phone, email, password, purpose, location, comments });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

module.exports = router;
