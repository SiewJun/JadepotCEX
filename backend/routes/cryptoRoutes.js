const express = require('express');
const cryptoController = require('../controllers/cryptoController');

const router = express.Router();

// Route to fetch all cryptocurrencies
router.get('/trading', cryptoController.getAllCryptos);

// Route to fetch a specific cryptocurrency by ID
router.get('/trading/:name', cryptoController.getCryptoPairByName);

module.exports = router;
