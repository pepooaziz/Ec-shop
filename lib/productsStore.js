const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '..', 'data', 'products.json');

function readProducts() {
  try {
    const raw = fs.readFileSync(productsPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeProducts(products) {
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
}

function getAll() {
  return readProducts();
}

function getById(id) {
  const products = readProducts();
  return products.find(p => p.id === Number(id));
}

function create(product) {
  const products = readProducts();
  const nextId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const newProduct = Object.assign({ id: nextId }, product);
  products.push(newProduct);
  writeProducts(products);
  return newProduct;
}

function update(id, updates) {
  const products = readProducts();
  const idx = products.findIndex(p => p.id === Number(id));
  if (idx === -1) return null;
  products[idx] = Object.assign(products[idx], updates);
  writeProducts(products);
  return products[idx];
}

function remove(id) {
  let products = readProducts();
  const before = products.length;
  products = products.filter(p => p.id !== Number(id));
  if (products.length === before) return false;
  writeProducts(products);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
