import db from "../db.js";
import Scoreboard from "./scoreboard.js";

class User {
    constructor({ id, username, hashedPassword }) {
        this.id = id;
        this.username = username;
        this.hashedPassword = hashedPassword;
    }
    static async get(identifier, ...columns) {
        let user;
        if (identifier.id) {
            user = await db.oneOrNone(
                `SELECT $1:name
                FROM account
                WHERE id = $2`,
                [columns, identifier.id]
            )
        } else if (identifier.username) {
            user = await db.oneOrNone(
                `SELECT $1:name
                FROM account
                WHERE username = $2`,
                [columns, identifier.username]
            )
        } else {
            console.log('No user found');
        }

        if (!user) return;

        return new User({
            id: user.id,
            username: user.username,
            hashedPassword: user.hashed_password
        })
    }
    static async search(query) {
        const users = await db.manyOrNone(`
            SELECT id, username 
            FROM account 
            WHERE username 
            LIKE CONCAT('%', $1, '%')`, 
            [query]
        );
        return users;
    }
    async save() {
        this.id = (await db.one(`
            INSERT INTO account (username, hashed_password) 
            VALUES ($1, $2)
            RETURNING id`, 
            [this.username, this.hashedPassword]
        )).id
    }
    async getScoreboards() {
        const scoreboards = await db.manyOrNone(
            `SELECT scoreboard.id, name, table_string
            FROM scoreboard
            INNER JOIN account_scoreboard
            ON scoreboard.id = account_scoreboard.scoreboard_id
            INNER JOIN account
            ON account.id = account_scoreboard.account_id
            WHERE account.id = $1`,
            [this.id]
        )
        return scoreboards.map(sb => new Scoreboard(sb.id, sb.name, sb.tableString));
    }
}

export default User;