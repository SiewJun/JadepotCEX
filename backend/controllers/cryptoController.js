const Crypto = require('../models/Crypto');

exports.getAllCryptos = async (req, res) => {
  try {
    const cryptos = await Crypto.findAll();
    res.status(200).json(cryptos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getCryptoPairByName = async (req, res) => {
  try {
    const { name } = req.params;
    
    // Find the base currency
    const baseCrypto = await Crypto.findOne({ where: { name } });
    if (!baseCrypto) {
      return res.status(404).json({ message: 'Base cryptocurrency not found' });
    }

    // Find the quote currency (assuming USDT)
    const quoteCrypto = await Crypto.findOne({ where: { name: 'tether' } });
    if (!quoteCrypto) {
      return res.status(404).json({ message: 'Quote cryptocurrency (USDT) not found' });
    }

    // Return both base and quote cryptocurrencies
    res.status(200).json({ baseCrypto, quoteCrypto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
