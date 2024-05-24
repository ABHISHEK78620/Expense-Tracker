const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');
const multer = require('multer');
const fs = require('fs');
// MongoDB connection
const mongoURL = 'mongodb://127.0.0.1:27017/ExpenseTracker';
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB connected successfully");
    })
    .catch((err) => {
        console.error("DB connection error:", err);
    });

// Session configuration
let configSession = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 24 * 7 * 60 * 60 * 1000,
        maxAge: 24 * 7 * 60 * 60 * 1000
    }
}
app.use(session(configSession));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // to convert the request data to JSON format
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
})); // to connect React with backend

// Import routes
const Routes = require('./routes/transactions');
const authroutes = require('./routes/auth');


// Mount routes
app.use(Routes);
app.use(authroutes);


const avatarSchema = new mongoose.Schema({
    username: String,
    avatarURL: String
});
const Avatar = mongoose.model('Avatar', avatarSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Upload avatar image endpoint
app.post('/avatar/:username', upload.single('avatar'), async (req, res) => {
    const username = req.params.username;
    const avatarPath = req.file.path;
    try {
        // Check if avatar already exists for the user
        let existingAvatar = await Avatar.findOne({ username });
        if (existingAvatar) {
            // Update existing avatar
            existingAvatar.avatarURL = avatarPath;
            existingAvatar = await existingAvatar.save();
            res.status(200).json({ avatarURL: existingAvatar.avatarURL });
        } else {
            // Create new avatar
            const newAvatar = await Avatar.create({ username, avatarURL: avatarPath });
            res.status(200).json({ avatarURL: newAvatar.avatarURL });
        }
    } catch (error) {
        console.error('Error uploading avatar:', error);
        res.status(500).send('Internal server error');
    }
});


// Retrieve avatar image endpoint
app.get('/avatar/:username', async (req, res) => {
    const username = req.params.username;

    try {
        // Retrieve avatar for the user
        const avatar = await Avatar.findOne({ username });
        if (avatar) {
            // Send avatar URL as JSON response
            res.status(200).json({ avatarURL: avatar.avatarURL });
        } else {
            res.status(404).json({ error: 'Avatar not found' });
        }
    } catch (error) {
        console.error('Error retrieving avatar:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Server
const PORT =  8000;
app.listen(PORT, () => {
    console.log(`Server connected at port ${PORT}`);
});
