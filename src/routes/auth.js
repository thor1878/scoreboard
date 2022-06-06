import passport from 'passport'
import { Router } from 'express'

const router = new Router();

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login/authenticate', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

router.post('/register/validate', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/register'
}));

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
})

export default router;