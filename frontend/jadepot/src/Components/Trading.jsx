import React, { useState, useEffect } from "react"; // eslint-disable-line
import axios from "axios";
import { Link } from "react-router-dom";
import Loading from "./Loading";

const Trading = () => {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState("marketCap");
  const [sortOrder, setSortOrder] = useState("desc");
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    axios
      .get("http://localhost:3000/trading")
      .then((response) => {
        setCryptos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cryptocurrencies:", error);
        setError(error.message); // Set error message
        setLoading(false);
      });
  }, []);

  // Function to format number with commas without rounding
  const formatNumberWithCommas = (number) => {
    const parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  // Function to handle sorting
  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("desc");
    }
  };

  // Function to compare values for sorting
  const compareValues = (a, b) => {
    const valA =
      typeof a[sortColumn] === "string"
        ? a[sortColumn].toUpperCase()
        : a[sortColumn];
    const valB =
      typeof b[sortColumn] === "string"
        ? b[sortColumn].toUpperCase()
        : b[sortColumn];

    let comparison = 0;
    if (valA > valB) {
      comparison = 1;
    } else if (valA < valB) {
      comparison = -1;
    }
    return sortOrder === "desc" ? comparison * -1 : comparison;
  };

  // Function to get color and icon based on price change percentage
  const getColorAndIcon = (percentage) => {
    if (percentage < 0) {
      return {
        color: "text-red-500",
        icon: (
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
              d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181"
            />
          </svg>
        ),
      };
    } else {
      return {
        color: "text-green-500",
        icon: (
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
              d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
            />
          </svg>
        ),
      };
    }
  };

  // Sort the cryptocurrencies based on the current sorting settings
  const sortedCryptos = [...cryptos].sort(compareValues);

  return (
    <div className="container mx-auto py-10">
      {loading ? (
        <Loading message="Loading cryptocurrencies..." />
      ) : error ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center text-red-500">
            <h1 className="text-4xl mb-4">Error</h1>
            <p className="text-xl">{error}</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-background1 shadow-md rounded-lg">
            <thead>
              <tr className="bg-background1 border-t-1 border-b border-gray-400">
                <th
                  className="sticky left-0 z-10 px-4 py-2 text-left text-sm font-semibold text-text1"
                  onClick={() => handleSort("name")}
                >
                  Coin{" "}
                  {sortColumn === "name" && (
                    <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
                <th
                  className="px-4 py-2 text-right text-sm font-semibold text-text1"
                  onClick={() => handleSort("currentPrice")}
                >
                  Price{" "}
                  {sortColumn === "currentPrice" && (
                    <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
                <th
                  className="px-4 py-2 text-right text-sm font-semibold text-text1"
                  onClick={() => handleSort("marketCap")}
                >
                  Market Cap{" "}
                  {sortColumn === "marketCap" && (
                    <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
                <th
                  className="px-4 py-2 text-right text-sm font-semibold text-text1"
                  onClick={() => handleSort("priceChangePercentage")}
                >
                  24h{" "}
                  {sortColumn === "priceChangePercentage" && (
                    <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCryptos.map((crypto) => (
                <tr key={crypto.id} className="border-b border-gray-400">
                  <td className="sticky left-0 z-10 px-4 py-3 bg-background1 truncate hover:bg-background2">
                    <Link
                      to={`/trading/${crypto.name}`}
                      className="flex items-center hover:text-indigo-500 no-underline"
                    >
                      <div className="flex items-center">
                        <img
                          src={crypto.imageUrl}
                          alt={crypto.name}
                          className="h-8 w-8 mr-2 rounded-full"
                        />
                        <div>
                          <div className="text-md font-semibold text-text1 capitalize truncate">
                            {crypto.name}
                          </div>
                          <div className="text-xs text-text1">
                            {crypto.symbol.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-text1 text-right">
                    ${formatNumberWithCommas(crypto.currentPrice)}
                  </td>
                  <td className="px-4 py-3 text-text1 text-right">
                    ${formatNumberWithCommas(crypto.marketCap)}
                  </td>
                  <td
                    className={`px-4 py-3 flex items-center justify-end ${
                      getColorAndIcon(crypto.priceChangePercentage).color
                    }`}
                  >
                    <span>{crypto.priceChangePercentage}%</span>
                    <span className="ml-1">
                      {getColorAndIcon(crypto.priceChangePercentage).icon}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Trading;
