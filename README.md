# EC-SHOP

Simple local e‑commerce demo (Node.js + Express).

## Overview
- Backend: Express.js
- Persistence: SQLite (`data/ecshop.db`) (migrated from `data/products.json` on first run)
- File uploads: `public/uploads/`
- Authentication: JWT (default admin user created on first run)

## Quick start

1. Install dependencies:

```powershell
Set-Location 'C:\Users\mylog\OneDrive\Desktop\ec-shop'
npm install
```

2. Run the server:

```powershell
npm start
# or for development with nodemon
npm run dev
```

3. Open the frontend in your browser:

http://localhost:3000

## API
- `GET /products` — List products
- `POST /products` — Create product (protected by JWT)
- `PUT /products/:id` — Update product (protected)
- `DELETE /products/:id` — Delete product (protected)
- `POST /auth/login` — Login, returns `{ token }`
- `POST /upload-images` — Upload multiple images (multipart/form-data field name `images`)

## Default credentials (for local testing)
- username: `admin`
- password: `password`

## Important files
- `index.js` — main server
- `routes/` — API route handlers
- `lib/productsStore.js` — data access (SQLite)
- `data/ecshop.db` — local SQLite DB (ignored by .gitignore)

## Notes & Security
- `JWT_SECRET` is currently a default in code; for production set a strong secret via environment variable.
- `data/ecshop.db` and `public/uploads/` are ignored from Git by `.gitignore`.
- This project is intended for local development and learning.

## License
Add a license if you plan to publish this repository publicly.

---
Uploaded to: https://github.com/pepooaziz/Ec-shop
# EC-SHOP

مستودع تجريبي لمشروع EC-SHOP.

- لتشغيل: `node index.js`
- الملف `products.json` محفوظ داخل مجلد `data`.
