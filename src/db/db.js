import pgPromise from 'pg-promise';

const options = {}
const pgp = pgPromise(options);

const db = pgp('postgres://postgres:password@localhost:5432/scoreboard');

db.none(`CREATE TABLE IF NOT EXISTS account (
    id SERIAL,
    username VARCHAR(30) UNIQUE,
    hashed_password VARCHAR
)`)

export default db;