const fs = require("fs");
const path = require("path");

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

    console.log("Uploading products...");
    products.forEach(product => {
        console.log(`Uploaded: ${product.name} ($${product.price})`);
    });
}

module.exports = upload;
