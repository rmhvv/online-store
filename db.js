const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydb.sqlite');

db.run(`
  CREATE TABLE IF NOT EXISTS Users (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Email TEXT UNIQUE,
    Password TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS Bag (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    ProductId TEXT,
    Name TEXT,
    Price REAL,
    Size TEXT,
    Quantity INTEGER DEFAULT 1,
    FOREIGN KEY(UserId) REFERENCES Users(Id)
  )
`);


module.exports = db;