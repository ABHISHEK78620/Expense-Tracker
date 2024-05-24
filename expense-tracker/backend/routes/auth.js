const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
// Route to register a user in the DB

router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validate input fields
    if (!email || !password || !username) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Email address is already registered. Please use a different email address' });
    }

    // Create a new user
    const user = new User({ email, username });
    const newUser = await User.register(user, password);

    // JSON response for successful registration
    res.json({ success: true, message: 'Welcome, you are registered successfully' });
  
  } catch (e) {
    // Send a JSON response for registration failure
    res.status(400).json({ success: false, message: e.message });
  }
});
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
  
      if (!user) {
        // Invalid login
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
  
      // Successful login
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }
  
        // Send a JSON response for successful login
        res.json({ success: true, message: 'Welcome back',userId:req.user._id,userName:req.user.username });
       // console.log(req.user); 
      });
    })(req, res, next);
});

// Route to logout
router.get('/logout', (req, res) => {
    req.logout();
});

module.exports = router;
