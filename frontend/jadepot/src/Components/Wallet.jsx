import React, { useState, useEffect } from "react"; // eslint-disable-line
import axios from "axios";
import Loading from "./Loading";
import WalletModal from "./WalletModal";

const Wallets = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);

  const createWallet = async () => {
    setShowConfirmation(true);
  };

  const confirmCreateWallet = async () => {
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

      await axios.post("http://localhost:3000/wallets", {}, config);

      await fetchWallets();
    } catch (error) {
      console.error("Error creating wallet:", error);
    } finally {
      setShowConfirmation(false);
    }
  };

  const fetchWallets = async () => {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        console.error("Authentication token not found.");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      const response = await axios.get("http://localhost:3000/wallets", config);
      setWallets(response.data);
    } catch (error) {
      console.error("Error fetching wallets:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  // Function to handle selection of a wallet
  const handleWalletClick = (wallet) => {
    // Leave balance values unchanged
    const walletWithUnchangedBalances = {
      ...wallet,
      WalletBalances: wallet.WalletBalances.map((balance) => ({
        ...balance,
        // Balance remains unchanged
      })),
    };
  
    setSelectedWallet(walletWithUnchangedBalances);
  };  

  return (
    <div className="container mx-auto mt-8">
      {/* Rendering Wallet Details Modal */}
      {selectedWallet && (
        <WalletModal
          wallet={selectedWallet}
          onClose={() => setSelectedWallet(null)}
        />
      )}

      {loading ? (
        <Loading message="Loading Wallets" />
      ) : error ? (
        <div className="flex items-center justify-center h-screen text-red-500 text-xl">
          {error}
        </div>
      ) : wallets.length === 0 ? (
        <>
          <button
            className="bg-blue1 hover:bg-accent1 text-text1 font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
            onClick={createWallet}
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
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
          <div className="flex items-center justify-center mt-4 text-xl text-text1 font-semibold">
            No wallets found for this user
          </div>
        </>
      ) : (
        <div>
          <button
            className="bg-blue1 hover:bg-accent1 text-text1 font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
            onClick={createWallet}
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
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="bg-background2 rounded-2xl p-4 shadow-md dark:border-2 dark:border-gray-600 cursor-pointer"
                onClick={() => handleWalletClick(wallet)}
              >
                <p className="font-semibold text-text1">
                  Wallet ID: {wallet.id}
                </p>
                {/* Filter out duplicate currencies */}
                {Array.from(
                  new Set(
                    wallet.WalletBalances.map((balance) => balance.currency)
                  )
                ).map((currency) => (
                  <div key={currency}>
                    <p className="font-semibold text-text1">
                      {currency.toUpperCase()}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-90 z-50">
          <div className="bg-background2 p-8 rounded-lg shadow-md">
            <p className="text-lg font-semibold mb-4 text-text1">
              Are you sure you want to create a wallet?
            </p>
            <div className="flex justify-end">
              <button
                className="mr-2 bg-blue1 hover:bg-accent1 text-text1 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={confirmCreateWallet}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 text-gray-700 hover:bg-gray-400 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallets;
