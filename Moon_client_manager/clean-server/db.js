// clean-server/db.js
const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

// create the database
const db = new Database(path.join(__dirname, 'moon.db'));


db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- אינדקסים שימושיים לביצועים (יבנו רק אם לא קיימים)
  CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
  CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_events_order_number ON events(order_number);
  CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
`);

//if empty fill with this info
function seed() {
  // table
  const ordersCount = db.prepare(`SELECT COUNT(*) AS c FROM orders`).get().c;
  if (ordersCount === 0) {
    const insertOrder = db.prepare(`INSERT INTO orders (order_number) VALUES (?)`);
    [
      "1","2","3","4","5","6","7","8","9","10",
      "11","12","13","14","15","16","17","18",
      "20","21","22","23","24","25","26","27","28"
    ].forEach(n => insertOrder.run(n));
  }

  // defult adminn
  const adminsCount = db.prepare(`SELECT COUNT(*) AS c FROM admins`).get().c;
  if (adminsCount === 0) {
    const hash = bcrypt.hashSync('1234', 10); // crypt password !! 
    db.prepare(`INSERT INTO admins (username, password) VALUES (?, ?)`)
      .run('admin', hash);
  }
}

seed();

module.exports = db;
