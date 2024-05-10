const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const cryptoRoutes = require('./routes/cryptoRoutes');
const walletRoutes = require('./routes/walletRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const path = require('path'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(express.json({
  limit: '5mb',
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(cors());

// Multer Static
app.use(express.static('uploads'));

// Routes
app.get('/', (req, res) => {
  res.send('I\'m ok. Rest assured ~');
});

// Use user routes
app.use(userRoutes);

// Use crypto routes
app.use(cryptoRoutes);

//use wallet routes
app.use(walletRoutes);

//use stripe routes
app.use(stripeRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
