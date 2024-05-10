const Wallet = require('../models/Wallet');
const WalletBalance = require('../models/WalletBalance');

exports.getAllWallets = async (req, res) => {
  try {
    // Retrieve user ID from req.user
    const user = req.user;

    // Find all wallets belonging to the user
    const wallets = await Wallet.findAll({ 
      where: { userId: user.userId },
      include: WalletBalance // Include WalletBalance model
    });

    res.status(200).json(wallets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createWallet = async (req, res) => {
  try {
    // Retrieve the user ID from the authenticated user's context
    const userId = req.user.userId; // Assuming the user ID is stored in req.user
    
    // Initialize wallet with default values
    const wallet = await Wallet.create({
      userId,
    });

    // Initialize wallet balance with default values
    await WalletBalance.create({
      walletId: wallet.id,
      currency: 'usd', // Specify default currency here
      balance: 0 // Specify default balance here
    });

    res.status(201).json(wallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteWallet = async (req, res) => {
  try {
    const { walletId } = req.params;

    // Find the wallet to delete
    const wallet = await Wallet.findByPk(walletId);

    // Check if the wallet exists
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    // Delete the wallet
    await wallet.destroy();

    res.status(200).json({ message: 'Wallet deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
