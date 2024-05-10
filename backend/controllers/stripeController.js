const stripe = require('stripe');
const Wallet = require('../models/Wallet');
const WalletBalance = require('../models/WalletBalance');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.userId; // Retrieve userId from req.user
    
    // Hardcode the Stripe secret key inside the function
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const stripeClient = stripe(stripeSecretKey);

    // Create a Checkout Session
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Top-up',
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5173/wallet', // Redirect URL after successful payment
      cancel_url: 'http://localhost:5173/wallet', // Redirect URL after cancelled payment
      payment_intent_data: {
        metadata: { userId: userId }
      },
    });

    // Return the Checkout Session ID to the client
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating Checkout Session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error('Webhook Error:', error.message);
    return res.status(400).json({ message: 'Webhook Error' });
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent:', paymentIntent);

      console.log('PaymentIntent was successful:', paymentIntent);
      
      try {
        const wallet = await Wallet.findOne({ where: { userId: paymentIntent.metadata.userId } });
        if (!wallet) {
            console.error('Wallet not found for user:', paymentIntent.metadata.userId);
            return res.status(404).json({ message: 'Wallet not found' });
        }
    
        let walletBalance = await WalletBalance.findOne({ 
            where: { 
                walletId: wallet.id,
                currency: paymentIntent.currency,
            } 
        });
    
        const paymentAmount = paymentIntent.amount / 100; // Convert amount to a decimal value
    
        if (!walletBalance) {
            walletBalance = await WalletBalance.create({
                walletId: wallet.id,
                currency: paymentIntent.currency,
                balance: paymentAmount,
            });
        } else {
            // Convert walletBalance.balance to a number if it's not already
            const currentBalance = typeof walletBalance.balance === 'number' ? walletBalance.balance : parseFloat(walletBalance.balance);
            
            // Ensure both currentBalance and paymentAmount are numbers before performing arithmetic operations
            if (isNaN(currentBalance) || isNaN(paymentAmount)) {
                throw new Error('Invalid balance or payment amount');
            }
    
            // Round the balance to 2 decimal places to avoid precision issues
            walletBalance.balance = parseFloat((currentBalance + paymentAmount).toFixed(2));
            await walletBalance.save();
        }
    
        console.log('Wallet balance updated:', walletBalance);
    } catch (error) {
        console.error('Error updating wallet balance:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
      
      break;
    case 'payment_intent.payment_failed':
      const paymentFailure = event.data.object;
      console.log('Payment failed:', paymentFailure);
      break;
    default:
      console.log('Unhandled event type:', event.type);
  }

  res.json({ received: true });
};
