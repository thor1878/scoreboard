import express from 'express';
import passport from 'passport';
import session from 'express-session';
import pgSession from 'connect-pg-simple';

import { setupPassport } from './auth/passport.js';
import authRouter from './routes/auth.js';
import db from './db/db.js';

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

// Routes
app.use((req, res, next) => {
    res.locals.user = req.user;
    next()
})

app.use(authRouter);

app.get('/', (req, res) => {
    res.render('index');
})



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
})