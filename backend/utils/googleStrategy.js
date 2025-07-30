const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Usuario = require('../models/Usuario');
const crypto = require('crypto');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Usuario.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await Usuario.findOne({ email });
    if (!user) {
      user = await Usuario.create({
        fullName: profile.displayName,
        email,
        password: crypto.randomBytes(32).toString('hex'), // No se usa
        profileImage: profile.photos[0]?.value || '',
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
})); 