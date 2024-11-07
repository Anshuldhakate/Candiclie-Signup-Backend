const express = require('express');
const User = require('../models.js/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, phone, email, password, confirmPassword, purpose, location, comments } = req.body;

  try {
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: 'Invalid phone number. Phone number must be exactly 10 digits.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long and include at least one number, one uppercase letter, one lowercase letter, and one special character.' 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ firstName, lastName, phone, email, password, purpose, location, comments });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // If successful, return a success message
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

router.post('/google-login', async (req, res) => {
  const { name, email, profilePicture } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create a new user
      user = new User({
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1] || '',
        email,
        phone: '', 
        profilePicture,
        purpose: 'Google Login', 
        password: '', 
      });

      await user.save();
    }

    res.status(200).json({ message: 'Google login successful', user });
  } catch (error) {
    console.error('Error in Google login:', error);
    res.status(500).json({ message: 'Server error during Google login', error });
  }
});

module.exports = router;
