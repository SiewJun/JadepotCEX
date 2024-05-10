import React, { useState, useEffect } from "react"; // eslint-disable-line
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";

const TradingPair = () => {
  const { name } = useParams();
  const [baseCrypto, setBaseCrypto] = useState(null);
  const [quoteCrypto, setQuoteCrypto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatNumberWithCommas = (number) => {
    if (number === null || number === undefined) return "N/A"; // Return "N/A" if number is null or undefined
    const parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };  

  useEffect(() => {
    const fetchCryptoPair = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/trading/${name}`
        );
        const { baseCrypto, quoteCrypto } = response.data;
        setBaseCrypto(baseCrypto);
        setQuoteCrypto(quoteCrypto);
      } catch (error) {
        console.error("Error fetching cryptocurrency pair:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoPair();
  }, [name]);

  const getTextColor = (percentage) => {
    return percentage < 0 ? "text-red-500" : "text-green-500";
  };

  const calculateBasePriceInUSDT = () => {
    if (baseCrypto && quoteCrypto) {
      // Calculate base currency price in USDT
      return baseCrypto.currentPrice * quoteCrypto.currentPrice;
    }
    return null;
  };

  return (
    <>
      {loading ? (
        <Loading message="Loading cryptocurrencies..." />
      ) : error ? (
        <div className="flex items-center justify-center h-screen container mx-auto text-text1 text-xl text-center">
          Error: {error}. Try another cryptocurrency.
        </div>
      ) : (
        <div className="mb-10">
          <div className="bg-background2 mb-3 shadow-md dark:border-b-2 dark:border-gray-600">
            <div className="container mx-auto p-1 text-center">
              <h3 className="text-lg font-semibold mb-0 text-text1 capitalize">
                {baseCrypto.symbol.toUpperCase()}/
                {quoteCrypto.symbol.toUpperCase()}
              </h3>
            </div>
          </div>
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-3 mx-auto">
              <div className="md:col-span-1 p-8 bg-background2 rounded-lg shadow-md dark:border-2 dark:border-gray-600">
                <p
                  className={`text-xl mb-0 font-semibold ${getTextColor(
                    baseCrypto.priceChangePercentage
                  )}`}
                >
                  {formatNumberWithCommas(calculateBasePriceInUSDT())}
                </p>
                <p className="text-sm text-text1">
                  {baseCrypto.priceChangePercentage < 0 ? "-" : "+"}
                  {Math.abs(baseCrypto.priceChangePercentage).toFixed(3)}%
                </p>
              </div>
              <div className="md:col-span-2 p-8 bg-background2 rounded-lg shadow-md dark:border-2 dark:border-gray-600">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="text-right">
                    <p className="text-sm text-text1 mb-0">Market Cap</p>
                    <p className="text-md text-primary1 font-semibold">
                      ${formatNumberWithCommas(baseCrypto.marketCap)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text1 mb-0">Total Supply</p>
                    <p className="text-md text-primary1 font-semibold">
                      {formatNumberWithCommas(baseCrypto.totalSupply)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text1 mb-0">Max Supply</p>
                    <p className="text-md text-primary1 font-semibold">
                      {formatNumberWithCommas(baseCrypto.maxSupply)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text1 mb-0">Circulating Supply</p>
                    <p className="text-md mb-0 text-primary1 font-semibold">
                      {formatNumberWithCommas(baseCrypto.circulatingSupply)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TradingPair;
