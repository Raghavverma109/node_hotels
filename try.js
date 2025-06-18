const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const db = require('./db'); // DB connection
const Person = require('./models/person');
const personRoutes = require('./routes/PersonRoutes');
const menuRoutes = require('./routes/menuRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------------
// Middleware
// ----------------------------

app.use(bodyParser.json());
app.use(passport.initialize());

// Log every request
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} request to ${req.url}`);
    next();
});

// ----------------------------
// Passport Strategy
// ----------------------------

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',    // Expected field: req.body.email
            passwordField: 'passcode'  // Expected field: req.body.passcode
        },
        async (email, passcode, done) => {
            try {
                console.log('Authenticating user with email:', email);

                const user = await Person.findOne({ email }); // Match email field

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                if (user.password !== passcode) {
                    return done(null, false, { message: 'Incorrect password' });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

// ----------------------------
// Routes
// ----------------------------

// Login route (POST)
app.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err);
        
        if (!user) return res.status(401).json({ message: info.message || 'Login failed' });

        console.log('User authenticated successfully:', user.email);

        // You could return a JWT here instead of user object
        res.send('Welcome to my hotel. We have a list of menus and rooms.');
    })(req, res, next);
});

// Protected route
app.get('/home', passport.authenticate('local', { session: false }),
    (req, res) => {
        res.send('Welcome to my hotel. We have a list of menus and rooms.');
    }
);

// Modular routes
app.use('/person', personRoutes);
app.use('/menu', menuRoutes);

// Catch-all 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// ----------------------------
// Start Server
// ----------------------------
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
