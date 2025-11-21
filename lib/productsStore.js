const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'data', 'ecshop.db');
const productsJsonPath = path.join(__dirname, '..', 'data', 'products.json');

// open (will create file if missing)
const db = new Database(dbPath);

// initialize table
db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  image TEXT,
  images TEXT
);
`);

// migrate from products.json if DB empty
const count = db.prepare('SELECT COUNT(1) as c FROM products').get().c;
if (!count) {
  try {
    const raw = fs.readFileSync(productsJsonPath, 'utf8');
    const arr = JSON.parse(raw);
    const insert = db.prepare('INSERT INTO products (id, name, price, stock, image, images) VALUES (?, ?, ?, ?, ?, ?)');
    const insertMany = db.transaction((items) => {
      for (const p of items) {
        insert.run(p.id, p.name, p.price, p.stock || 0, p.image || null, p.images ? JSON.stringify(p.images) : null);
      }
    });
    insertMany(arr);
    console.log('Migrated', arr.length, 'products into SQLite');
  } catch (err) {
    // if file missing or invalid, ignore
    console.warn('No initial JSON migration performed:', err.message);
  }
}

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    stock: row.stock,
    image: row.image,
    images: row.images ? JSON.parse(row.images) : undefined
  };
}

function getAll() {
  const rows = db.prepare('SELECT * FROM products ORDER BY id').all();
  return rows.map(mapRow);
}

function getById(id) {
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(id));
  return mapRow(row);
}

function create(product) {
  const stmt = db.prepare('INSERT INTO products (name, price, stock, image, images) VALUES (?, ?, ?, ?, ?)');
  const info = stmt.run(product.name, product.price, product.stock || 0, product.image || null, product.images ? JSON.stringify(product.images) : null);
  return getById(info.lastInsertRowid);
}

function update(id, updates) {
  const p = getById(id);
  if (!p) return null;
  const newObj = Object.assign({}, p, updates);
  const stmt = db.prepare('UPDATE products SET name = ?, price = ?, stock = ?, image = ?, images = ? WHERE id = ?');
  stmt.run(newObj.name, newObj.price, newObj.stock || 0, newObj.image || null, newObj.images ? JSON.stringify(newObj.images) : null, Number(id));
  return getById(id);
}

function remove(id) {
  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  const info = stmt.run(Number(id));
  return info.changes > 0;
}

module.exports = { getAll, getById, create, update, remove };
