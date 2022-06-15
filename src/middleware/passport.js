import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

import User from '../db/models/user.js';

export function setupPassport(passport) {
    // Strategy for authentication
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, async (username, password, cb) => {
            const user = await User.get({ username: username }, 'id', 'hashed_password');

            // Check if user exists and the correct password is entered
            if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
                return cb(null, false);
            }
            
            return cb(null, {
                id: user.id,
                username: username
            });
        }
    ))

    // Strategy for registration
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password1',
        passReqToCallback: true
    }, async (req, username, password, cb) => {
            // Check if a user with that username already exists
            const user = await User.get({ username: username }, 'id', 'username');
            if (user) {
                console.log('User already exists');
                return cb(null, false);
            }
            // Check if the two passwords match
            if (req.body.password1 !== req.body.password2) {
                console.log('Passwords does not match');
                return cb(null, false);
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ 
                username: username,
                hashedPassword: hashedPassword
            })
            await newUser.save();
            
            return cb(null, {
                id: newUser.id,
                username: username
            })
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}