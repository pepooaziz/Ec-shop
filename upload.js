const fs = require("fs");
const path = require("path");
const store = require('./lib/productsStore');

function upload() {
    let products = [];
    try {
        const productsPath = path.join(__dirname, "data", "products.json");
        const raw = fs.readFileSync(productsPath, "utf8");
        products = JSON.parse(raw);
    } catch (err) {
        console.error('upload(): Failed to read or parse products.json:', err.message);
        return;
    }

    console.log("Uploading products into DB (skipping existing names)...");
    const existing = store.getAll().map(p => (p.name || '').toLowerCase());
    let added = 0;
    for (const product of products) {
        if (existing.includes((product.name || '').toLowerCase())) {
            console.log(`Skipping existing: ${product.name}`);
            continue;
        }
        const created = store.create({ name: product.name, price: product.price, stock: product.stock || 0, image: product.image || null, images: product.images || null });
        console.log(`Inserted: ${created.name} (id=${created.id})`);
        added++;
    }
    console.log(`Upload complete. Added ${added} new products.`);
}

module.exports = upload;
