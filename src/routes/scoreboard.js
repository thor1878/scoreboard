import { Router } from 'express'

import User from '../db/models/user.js';
import Scoreboard from '../db/models/scoreboard.js';

const router = new Router();

// List 
router.get('/scoreboards', async (req, res) => {
    // Get all scoreboards that the user is part of
    const user = await User.get({ id: req.user.id }, 'id', 'username');
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
router.get('/scoreboards/:id', async (req, res) => {
    const scoreboard = await Scoreboard.getById(req.params.id);
    scoreboard.tableString = scoreboard.tableString.replaceAll(' contenteditable="true"', '');
    const users = await scoreboard.getUsers();

    res.render('scoreboardDetail', { scoreboard: scoreboard, users: users });
})

// Update 
router.get('/scoreboards/:id/update', (req, res) => {
    
})

// Delete 
router.get('/scoreboards/:id/delete', (req, res) => {
    
})


export default router;