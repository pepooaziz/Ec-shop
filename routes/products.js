const express = require('express');
const router = express.Router();
const store = require('../lib/productsStore');
const { body, validationResult, query } = require('express-validator');

// GET /products - list
// GET /products - list (supports ?q=search)
router.get('/', [ query('q').optional().isString() ], (req, res) => {
  const q = req.query.q;
  let list = store.getAll();
  if (q) {
    const ql = q.toLowerCase();
    list = list.filter(p => (p.name || '').toLowerCase().includes(ql));
  }
  res.json(list);
});

// GET /products/:id - get one
router.get('/:id', (req, res) => {
  const p = store.getById(req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

// POST /products - create
// POST /products - create
router.post('/',
  body('name').isString().notEmpty(),
  body('price').isFloat({ gt: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
    const { name, price, stock, image } = req.body;
    const created = store.create({ name, price: Number(price), stock: Number(stock || 0), image });
    res.status(201).json(created);
  }
);

// PUT /products/:id - update
// PUT /products/:id - update
router.put('/:id',
  body('name').optional().isString().notEmpty(),
  body('price').optional().isFloat({ gt: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
    const updated = store.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  }
);

// DELETE /products/:id - delete
router.delete('/:id', (req, res) => {
  const ok = store.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

module.exports = router;
