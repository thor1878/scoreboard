import { Router } from 'express'

const router = new Router();

router.get('/', (req, res) => {
    if (req.user) {
        res.redirect('/scoreboards');
    } else {
        res.render('index');        
    }
})

export default router;