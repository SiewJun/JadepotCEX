import React, { useState, useEffect } from "react"; // eslint-disable-line
import PropTypes from "prop-types";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const WalletModal = ({ wallet, onClose }) => {
  const [confirmationInput, setConfirmationInput] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);
  const [topupAmount, setTopupAmount] = useState(""); // New state for top-up amount
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    // Initialize Stripe.js
    const initializeStripe = async () => {
      const stripePromise = await loadStripe(
        "pk_test_51OWiEQCCMmSWwXNwanq3QohV8Y3sqnZ3q6GH8tZqEQTG8WeArIDHe1eylMyIr0uzzjv4llSc9lqww1noFcia3faJ00m1YjGA5U"
      );
      setStripe(stripePromise);
    };

    initializeStripe();
  }, []);

  const handleDeleteWallet = async () => {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        console.error("Authentication token not found.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      await axios.delete(`http://localhost:3000/wallets/${wallet.id}`, config);

      // Reload the page after successful deletion
      window.location.reload();
    } catch (error) {
      console.error("Error deleting wallet:", error);
    }
  };

  const handleConfirmation = () => {
    if (confirmationInput === wallet.id) {
      setShowConfirmation(false);
      handleDeleteWallet();
    } else {
      setError("Enter the correct wallet ID to confirm deletion.");
    }
  };

  const handleTopup = async () => {
    try {
      // Validate top-up amount
      const amount = parseFloat(topupAmount);

      if (isNaN(amount) || amount < 0.95) {
        setError("Top-up amount must be at least 0.95.");
        return;
      }

      const roundedAmount = Math.round(amount * 100) / 100;

      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        console.error("Authentication token not found.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      const response = await axios.post(
        `http://localhost:3000/payment-intents`,
        { amount: roundedAmount },
        config
      );
      const sessionId = response.data.sessionId;

      stripe.redirectToCheckout({
        sessionId: sessionId,
      });
    } catch (error) {
      console.error("Error creating PaymentIntent:", error);
      setError("Failed to create PaymentIntent");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-90 z-50">
      <div className="bg-background2 p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-text1">Wallet Details</h2>
          <button className="text-text1 focus:outline-none" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 hover:text-accent1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p className="font-semibold text-text1">Wallet ID: {wallet.id}</p>

        {/* Display wallet balance details */}
        {wallet.WalletBalances.map((balance) => (
          <div key={balance.id}>
            <p className="font-semibold text-text1">
              Currency: {balance.currency.toUpperCase()}
            </p>
            <p className="font-semibold text-text1">
              Balance: {parseFloat(balance.balance)}
            </p>
          </div>
        ))}

        <div className="mt-4">
          <input
            type="number"
            min="0"
            className="border-2 border-gray-500 focus:border-gray-600 focus:ring focus:ring-gray-600 focus:text-gray-500 px-2 py-1 rounded-md"
            placeholder="Enter top-up amount"
            value={topupAmount}
            onChange={(e) => setTopupAmount(e.target.value)}
          />
          <button
            className="bg-green-500 hover:bg-green-600 text-text1 font-semibold py-1 px-4 rounded focus:outline-none focus:shadow-outline md:ml-2 mt-2 md:mt-0"
            onClick={handleTopup}
          >
            Top Up
          </button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>

        {/* Garbage icon delete button */}
        <button
          className="bg-red-500 hover:bg-red-600 text-text1 font-semibold py-1 px-2 rounded focus:outline-none focus:shadow-outline mt-4"
          onClick={() => setShowConfirmation(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>

        {/* Confirmation modal */}
        {showConfirmation && (
          <div className="mt-4">
            <input
              type="text"
              className="border-2 border-red-500 focus:border-red-600 focus:ring focus:ring-red-600 focus:text-red-500 px-2 py-1 rounded-md"
              placeholder="Type wallet ID to confirm deletion"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
            />
            <button
              className="bg-red-500 hover:bg-red-600 text-text1 font-semibold py-1 px-4 rounded focus:outline-none focus:shadow-outline md:ml-2 mt-2 md:mt-0"
              onClick={handleConfirmation}
            >
              Confirm Delete
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

WalletModal.propTypes = {
  wallet: PropTypes.shape({
    id: PropTypes.string.isRequired,
    WalletBalances: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        currency: PropTypes.string.isRequired,
        balance: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default WalletModal;
