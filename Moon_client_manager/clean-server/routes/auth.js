const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '12h';

// token
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: 'missing token' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: 'invalid token' });
  }
}

// client login
router.post('/client-login', (req, res) => {
  const { orderNumber } = req.body;
  if (!orderNumber) return res.status(400).json({ success: false, message: 'missing orderNumber' });

  const row = db.prepare('SELECT 1 FROM orders WHERE order_number = ?').get(orderNumber);
  res.json({ success: !!row });
});

// admin login
router.post('/admin-login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ success: false, message: 'missing credentials' });

  const row = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  if (!row) return res.json({ success: false, message: 'user not found' });

  const ok = bcrypt.compareSync(password, row.password);
  if (!ok) return res.json({ success: false, message: 'invalid password' });

  const token = jwt.sign({ sub: row.id, username: row.username, role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  res.json({ success: true, token });
});

//report event
router.post('/report-event', (req, res) => {
  const { orderNumber, type } = req.body;
  if (!orderNumber || !type) return res.status(400).json({ success: false, message: 'missing orderNumber or type' });

  const exists = db.prepare('SELECT 1 FROM orders WHERE order_number = ?').get(orderNumber);
  if (!exists) return res.status(404).json({ success: false, message: 'order not found' });

  db.prepare('INSERT INTO events (order_number, type) VALUES (?, ?)').run(orderNumber, type);
  res.json({ success: true });
});

// pull events
router.get('/events', requireAdmin, (req, res) => {
  const rows = db.prepare(`
    SELECT id, order_number AS orderNumber, type, created_at AS createdAt
    FROM events
    ORDER BY created_at DESC, id DESC
  `).all();
  res.json({ events: rows });
});

// delete event
router.delete('/events/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ success: false, message: 'invalid id' });

  const info = db.prepare('DELETE FROM events WHERE id = ?').run(id);
  res.json({ success: info.changes > 0 });
});

// clear events
router.post('/clear-events', requireAdmin, (_req, res) => {
  db.prepare('DELETE FROM events').run();
  res.json({ success: true });
});

// add table
router.post('/add-order', requireAdmin, (req, res) => {
  const { orderNumber } = req.body;
  if (!orderNumber) return res.status(400).json({ success: false, message: 'Missing order number' });

  try {
    db.prepare('INSERT INTO orders (order_number) VALUES (?)').run(orderNumber);
    res.json({ success: true });
  } catch (e) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ success: false, message: 'Order already exists' });
    }
    res.status(500).json({ success: false, message: 'DB error' });
  }
});

// delete order
router.post('/remove-order', requireAdmin, (req, res) => {
  const { orderNumber } = req.body;
  if (!orderNumber) return res.status(400).json({ success: false, message: 'Missing order number' });

  const info = db.prepare('DELETE FROM orders WHERE order_number = ?').run(orderNumber);
  if (info.changes === 0) return res.status(404).json({ success: false, message: 'Order not found' });

  res.json({ success: true });
});

module.exports = router;
