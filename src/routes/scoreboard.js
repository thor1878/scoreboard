import fetch from 'node-fetch';
import { Router } from 'express'

import db from '../db/db.js';
import User from '../db/models/user.js';

const router = new Router();

// List 
router.get('/scoreboards', async (req, res) => {
    // Get all scoreboards that the user is part of
    const user = await User.getById(req.user.id);
    const scoreboards = await user.getScoreboards();
    
    // Find all the users that are part of each scoreboard
    for (const scoreboard of scoreboards) {
        scoreboard.users = await scoreboard.getUsers();
    }

    res.render('scoreboardList', { scoreboards: scoreboards });
})

// Create 
router.get('/scoreboards/create', (req, res) => {
    res.render('scoreboardCreate');
})


// Detail 
router.get('/scoreboards/:id', (req, res) => {

})

// Update 
router.get('/scoreboards/:id/update', (req, res) => {
    
})

// Delete 
router.get('/scoreboards/:id/delete', (req, res) => {
    
})


export default router;