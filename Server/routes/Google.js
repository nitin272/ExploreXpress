require("dotenv").config();
const express = require("express");
const router = express.Router();
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const session = require("express-session");
const cors = require("cors");
const User = require("../models/Google"); // Update the path to your User model

// Setup environment variables
const clientid = process.env.CLIENT_ID;
const clientsecret = process.env.CLIENT_SECRET;
const sessionSecret = process.env.SESSION_SECRET;



// Setup session middleware
router.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize Passport
router.use(passport.initialize());
router.use(passport.session());

// Configure Passport with Google OAuth
passport.use(new OAuth2Strategy({
    clientID: clientid,
    clientSecret: clientsecret,
    callbackURL: "https://explorexpress-n2ek.onrender.com/auth/google/callback",
    scope: ["profile", "email"]
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos[0].value
            });

            await user.save();
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);  // Store user ID in the session
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google OAuth routes
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: "https://explorexxpresss.netlify.app/login"
}), (req, res) => {
    // Successful authentication
    res.redirect("https://explorexxpresss.netlify.app/");
});

// Logout route
router.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect("https://explorexxpresss.netlify.app");
    });
});

// User profile route (optional)
router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({ message: "User logged in", user: req.user });
    } else {
        res.status(400).json({ message: "Not authorized" });
    }
});

module.exports = router;
