import express from 'express';
import passport from 'passport';
import session from 'express-session';
import pgSession from 'connect-pg-simple';

import { setupPassport } from './middleware/passport.js';

import authRouter from './routes/auth.js';
import apiRouter from './routes/api.js';
import scoreboardRouter from './routes/scoreboard.js';
import homeRouter from './routes/home.js';

import { isAutheticated } from './middleware/isAuthenticated.js';

import db from './db/db.js';

import util from 'util';
util.inspect.defaultOptions.depth = null;

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine and views folder
app.set('view engine', 'pug');
app.set('views', 'src/views');

// Request parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup session
app.use(session({
    store: new (pgSession(session))({
        pgPromise: db,
        createTableIfMissing: true
    }),
    secret: 'asdfghjklæ',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

// Setup passport
setupPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use('/static', express.static('src/public'));

// Last middleware before routes
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
})

// Routes
app.use(homeRouter);
app.use(authRouter);
app.use(isAutheticated) // All routes below require authentication
app.use(apiRouter);
app.use(scoreboardRouter);



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
})