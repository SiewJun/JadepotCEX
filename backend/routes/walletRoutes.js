const express = require('express');
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/wallets', authMiddleware, walletController.getAllWallets);
router.post('/wallets', authMiddleware, walletController.createWallet);
router.delete('/wallets/:walletId', authMiddleware, walletController.deleteWallet);


module.exports = router;
