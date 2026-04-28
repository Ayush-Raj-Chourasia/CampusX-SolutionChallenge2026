const vertexAI = require('../services/ai/vertexAI');

async function suggestPrice(req, res, next) {
  try {
    const item = req.body || req.query || {};
    const result = await vertexAI.suggestPrice(item);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { suggestPrice };
