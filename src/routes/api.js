import { Router } from "express";

import User from "../db/models/user.js";
import Scoreboard from "../db/models/scoreboard.js";

const router = new Router();

// ------------- Users -------------

// Get all users matching the query
router.get('/api/users', async (req, res) => {
    const query = req.query.q;
    const users = await User.search(query);
    res.send({
        users: users.map(user => user.username),
        requestingUser: req.user.username
    })
})

// ------------- Scoreboards -------------

router.get('/api/scoreboards/:id/users', (req, res) => {

})
// Create a scoreboard
router.post('/api/scoreboards', async (req, res) => {
    const name = req.body.name;
    const usernames = req.body.users;
    const tableString = req.body.tableString;
    const creator = req.user.username

    // Create new scoreboard and user-relations in database
    const scoreboard = new Scoreboard(null, name, tableString, creator, usernames);
    await scoreboard.save();

    res.sendStatus(200);
})

export default router;