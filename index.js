const express = require("express");
const fs = require("fs");
const path = require("path");
const upload = require("./upload");
const productsRouter = require('./routes/products');

const app = express();
const PORT = 3000;

// prepare uploads folder
const uploadsDir = path.join(__dirname, 'public', 'uploads');
try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch (e) {}

// image upload endpoint (multer used later)
const multer = require('multer');
const storage = multer.diskStorage({ destination: uploadsDir, filename: (req,file,cb)=>{ const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-]/g,'_'); cb(null, safe); } });
const uploadImg = multer({ storage });
app.post('/upload-image', uploadImg.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    const rel = `/uploads/${req.file.filename}`;
    res.json({ path: rel });
});

// قراءة المنتجات من الملف (مع تعامل آمن مع الأخطاء)
let products = [];
try {
    const productsPath = path.join(__dirname, "data", "products.json");
    const raw = fs.readFileSync(productsPath, "utf8");
    products = JSON.parse(raw);
} catch (err) {
    console.error('Failed to read or parse products.json:', err.message);
    products = [];
}

app.use(express.json());

// simple request logger for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} -> ${req.method} ${req.originalUrl}`);
    next();
});

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Mount products API
app.use('/products', productsRouter);

// Serve frontend at root (fallback)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// تشغيل رفع المنتجات
app.get("/upload", (req, res) => {
    upload();
    res.send("Products uploaded! Check console.");
});

// API تعرض كل المنتجات
app.get("/products", (req, res) => {
    res.json(products);
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
