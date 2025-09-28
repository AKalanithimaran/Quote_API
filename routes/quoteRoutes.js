// Backend/routes/quoteRoutes.js
const express = require('express');
const router = express.Router();
const { addQuote, getQuotes, deleteQuote } = require('../controllers/quoteController');

router.post('/addquote', addQuote);
router.get('/getquote', getQuotes);
router.delete("/:id", deleteQuote);

module.exports = router;
