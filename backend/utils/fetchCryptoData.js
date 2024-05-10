const axios = require('axios');
const Crypto = require('../models/Crypto'); // Assuming Crypto is the model for your cryptocurrencies table

// List of cryptocurrencies to fetch from CoinGecko by name
const cryptocurrencyNames = [
    'bitcoin',
    'ethereum',
    'solana',
    'digitalbits',
    'power-ledger',
    'tether',
    'binancecoin',
    'monero',
    'cardano',
    'tron'
];

const API_KEY = //User your own API Key from Coingecko;

async function fetchCryptoData() {
    try {
        for (const name of cryptocurrencyNames) {
            try {
                const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${name}?x_cg_demo_api_key=${API_KEY}`);
                const data = response.data;

                // Extract required data
                const { id, symbol, market_data } = data;
                const currentPrice = market_data.current_price.usd;
                const marketCap = market_data.market_cap.usd;
                const imageUrl = data.image.small;
                const priceChangePercentage = market_data.price_change_percentage_24h;

                // Extract supply data from market_data
                const { total_supply, max_supply, circulating_supply } = market_data;

                // Check if the cryptocurrency exists in the database
                let existingCrypto = await Crypto.findOne({ where: { symbol } });

                // If the cryptocurrency exists, update its data; otherwise, create a new entry
                if (existingCrypto) {
                    await existingCrypto.update({
                        name: id,
                        symbol,
                        currentPrice,
                        marketCap,
                        imageUrl,
                        priceChangePercentage,
                        totalSupply: total_supply,
                        maxSupply: max_supply,
                        circulatingSupply: circulating_supply
                    });
                } else {
                    await Crypto.create({
                        name: id,
                        symbol,
                        currentPrice,
                        marketCap,
                        imageUrl,
                        priceChangePercentage,
                        totalSupply: total_supply,
                        maxSupply: max_supply,
                        circulatingSupply: circulating_supply
                    });
                }
            } catch (error) {
                if (error.response && error.response.status === 429 && error.response.headers['retry-after']) {
                    const retryAfterSeconds = parseInt(error.response.headers['retry-after'], 10);
                    console.log(`Rate limited. Retrying after ${retryAfterSeconds} seconds.`);
                    await new Promise(resolve => setTimeout(resolve, retryAfterSeconds * 1000));
                    continue; // Retry the request after waiting
                }
                throw error;
            }
        }

        console.log('Cryptocurrency data fetched and stored successfully.');
    } catch (error) {
        console.error('Error fetching or storing cryptocurrency data:', error);
    }
}

fetchCryptoData();
