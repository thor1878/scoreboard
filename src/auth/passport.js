import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

import db from '../db/db.js';

export function setupPassport(passport) {
    // Strategy for authentication
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, async (username, password, cb) => {
            const user = await db.oneOrNone(`SELECT hashed_password FROM account WHERE username = $1`, [
                username
            ])
            // Check if user exists and the correct password is entered
            if (!user || !(await bcrypt.compare(password, user.hashed_password))) {
                return cb(null, false);
            }
            
            return cb(null, {
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
            const user = await db.oneOrNone(`SELECT username FROM account WHERE username = $1`, [
                username
            ])
            if (user) {
                console.log('User already exists');
                return cb(null, false);
            }
            // Check if the two passwords match
            if (req.body.password1 !== req.body.password2) {
                console.log('Passwords does not match');
                return cb(null, false);
            }
            

            const hashed_password = await bcrypt.hash(password, 10);
            await db.none('INSERT INTO account (username, hashed_password) VALUES ($1, $2)', [
                username, hashed_password
            ])
            cb(null, {
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