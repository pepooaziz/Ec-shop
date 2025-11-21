const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const users = require('../lib/usersStore');
const { SECRET } = require('../middleware/auth');

// POST /auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const user = users.findByUsername(username);
  if (!user || !users.verifyPassword(user, password)) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '8h' });
  res.json({ token });
});

module.exports = router;
