const express = require('express');
const router = express.Router();
const { suggestPrice } = require('../controllers/ai.controller');

// POST /api/ai/price  { title, price, condition }
router.post('/price', suggestPrice);

// GET /api/ai/price?title=...&price=...&condition=...
router.get('/price', suggestPrice);

module.exports = router;
