const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'data', 'ecshop.db');
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
`);

function createUser(username, password) {
  const hash = bcrypt.hashSync(password, 10);
  try {
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const info = stmt.run(username, hash);
    return { id: info.lastInsertRowid, username };
  } catch (err) {
    return null;
  }
}

function findByUsername(username) {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username) || null;
}

function verifyPassword(user, password) {
  if (!user) return false;
  return bcrypt.compareSync(password, user.password);
}

// ensure default admin exists
const admin = findByUsername('admin');
if (!admin) {
  createUser('admin', 'password');
  console.log('Created default admin user (username: admin, password: password)');
}

module.exports = { createUser, findByUsername, verifyPassword };
