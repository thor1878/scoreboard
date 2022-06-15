import db from "../db.js";

class Scoreboard {
    constructor(id, name, tableString, creator, usernames) {
        this.id = id;
        this.name = name;
        this.tableString = tableString;
        this.creator = creator;
        this.usernames = usernames;
    }
    static async getAll() {

    }
    static async getById(id) {
        const scoreboard = await db.oneOrNone(
            `SELECT *
            FROM scoreboard
            WHERE id = $1`,
            [id]
        )
        return new Scoreboard(scoreboard.id, scoreboard.name, scoreboard.table_string)
    }
    async save() {
        this.id = (await db.one(
            `INSERT INTO scoreboard (name, table_string)
            VALUES ($1, $2)
            RETURNING id`,
            [this.name, this.tableString]
        )).id
        
        // Get id of all users 
        this.users = await db.manyOrNone(
            `SELECT id, username
            FROM account
            WHERE username
            IN ($1:csv)`,
            [[...this.usernames, this.creator]]
        )

        // Create new account_scoreboard relation in database
        // for each user invited to the scoreboard (including the creator)
        for (const user of this.users) {
            await db.none(
                `INSERT INTO account_scoreboard (account_id, scoreboard_id)
                VALUES ($1, $2)`,
                [user.id, this.id]
            )
        }
    }
    async getUsers() {
        const users = await db.manyOrNone(
            `SELECT account.id, username
            FROM account
            INNER JOIN account_scoreboard
            ON account.id = account_scoreboard.account_id
            INNER JOIN scoreboard
            ON scoreboard.id = account_scoreboard.scoreboard_id
            WHERE scoreboard.id = $1`,
            [this.id]
        )
        return users;
    }
}

export default Scoreboard;