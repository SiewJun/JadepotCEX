const express = require('express');
const stripeController = require('../controllers/stripeController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Route for creating a PaymentIntent
router.post('/payment-intents', authMiddleware, stripeController.createPaymentIntent);

// Route for handling webhook events
router.post('/webhook', stripeController.handleWebhook);

module.exports = router;
