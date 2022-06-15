import pgPromise from 'pg-promise';

const options = {}
const pgp = pgPromise(options);

const db = pgp(process.env.DB_CONN_STRING);

async function setupDB() {
    // await db.none('DROP TABLE IF EXISTS account_scoreboard');
    // await db.none('DROP TABLE IF EXISTS account');
    // await db.none('DROP TABLE IF EXISTS scoreboard');
    
    await db.none(`CREATE TABLE IF NOT EXISTS account (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30) UNIQUE,
        hashed_password VARCHAR
    )`)
    
    await db.none(`CREATE TABLE IF NOT EXISTS scoreboard (
        id SERIAL PRIMARY KEY,
        name varchar(100),
        table_string varchar
    )`)
    
    await db.none(`CREATE TABLE IF NOT EXISTS account_scoreboard (
        id SERIAL,
        account_id int NOT NULL,
        scoreboard_id int NOT NULL,
        PRIMARY KEY (account_id, scoreboard_id),
        FOREIGN KEY (account_id) REFERENCES account(id),
        FOREIGN KEY (scoreboard_id) REFERENCES scoreboard(id)
    )`)
}

setupDB();

export default db;