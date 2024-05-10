import React, { useEffect } from "react";  // eslint-disable-line
import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoutes = () => {
  const navigate = useNavigate();

  // Function to check if the authentication token is valid
  const isAuthenticated = () => {
    // Get the authentication token from local storage
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      return false; // Token doesn't exist
    }

    try {
      // Decode the token to extract its payload
      const decodedToken = jwtDecode(authToken);
      const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
      
      // Check if the token is expired
      if (Date.now() >= expirationTime) {
        // Remove the token from local storage
        localStorage.removeItem("authToken");
        return false; // Token is expired
      }

      // Token is valid and not expired
      return true;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false; // Error decoding token
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/signin");
    }
  }, [navigate]);

  return <>{isAuthenticated() ? <Outlet /> : null}</>;
};

export default PrivateRoutes;
