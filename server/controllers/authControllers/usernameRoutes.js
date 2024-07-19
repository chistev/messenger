const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const deserializeUser = require('../../middleware/deserializeUser')

router.get('/check-username', async (req, res) => {
    const { username } = req.query;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.json({ available: false });
        } else {
            res.json({ available: true });
        }
    } catch (error) {
        console.error('Error checking username:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/select-username', deserializeUser, async (req, res) => {
    console.log('select-username route called');
    console.log('Request received:', {
        headers: req.headers,
        body: req.body,
        user: req.user
    });

    const tempUser = req.user;

    if (!tempUser) {
        console.log('No user found in session, redirecting to sign-in');
        return res.redirect('/signin');
    }

    const { username } = req.body;

    let errors = [];
    if (username.length < 5) {
        errors.push('Your username must be at least 5 characters long.');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Your username can only contain letters, numbers, and \'_\'.');
    }

    console.log('Validating username:', username);
    const existingUser = await User.findOne({ googleId: tempUser.googleId });
    if (existingUser && existingUser.username) {
        errors.push('You have already created a username.');
    }

    if (errors.length > 0) {
        console.log('Validation errors:', errors);
        return res.status(400).json({ error: errors.join(' ') });
    }

    const newUser = new User({
        googleId: tempUser.googleId,
        email: tempUser.email,
        username
    });

    try {
        console.log('Saving new user:', newUser);
        await newUser.save();
        
        // Debugging statements
        console.log('New user saved:', newUser);
        console.log('Assigning user ID to session:', newUser._id);
        
        req.login(newUser, function (err) {
            if (err) {
                console.error('Error logging in newly created user:', err);
                return res.status(500).json({ error: 'Server error' });
            }
            
            // Debugging statements
            console.log('Before serialization, session:', req.session);

            res.json({ success: true });
        });
    } catch (error) {
        console.error('Error creating new user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
