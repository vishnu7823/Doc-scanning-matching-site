const sqlite = require('sqlite3').verbose();
const path = require('path');

const Db_path = path.join(__dirname,'../data/database.sqlite');

const db = new sqlite.Database(Db_path,(err)=>{
    if(err){
        console.log('failed to connect',err)
    }else{
        console.log('connected to DB');
    }

})

//table for users
db.run(
    `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT ,
    role TEXT DEFAULT 'user',
    credits INTEGER DEFAULT 20 
    )`
)

//table for documents
db.run(
    `CREATE TABLE IF NOT EXISTS documents(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    filename TEXT,
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES  users(id)

    )`
)

//table for credits

db.run(
    `CREATE TABLE IF NOT EXISTS credit_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        amount INTEGER,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`
);
module.exports = db;