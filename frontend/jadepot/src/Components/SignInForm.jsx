import React, { useState, useEffect } from "react"; // eslint-disable-line
import PropTypes from "prop-types";
import axios from "axios";
import { Link } from "react-router-dom";

const SignInForm = ({ onSignIn }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  useEffect(() => {
    const isFormValid = Object.values(credentials).every(
      (value) => value.trim() !== ""
    );
    setIsSubmitDisabled(!isFormValid);
  }, [credentials]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic client-side validation
      if (!credentials.email || !credentials.password) {
        setErrors({ message: "All fields are required" });
        setIsSubmitting(false);
        return;
      }

      // Send a POST request to the server
      const response = await axios.post(
        "http://localhost:3000/signin",
        credentials
      );

      // Handle successful sign-in
      onSignIn(response.data.token);
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data) {
        setErrors({ message: error.response.data.message });
      } else {
        setErrors({
          message: "An unexpected error occurred. Please try again later.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="max-w-lg mx-auto">
        <div className="flex left-align items-center mt-8 mb-8">
          <img
            src="/src/assets/jadepotlogo.png"
            alt="Jadepot Logo"
            className="h-16 w-16 mr-4"
          />
          <h2 className="text-2xl text-primary1 font-semibold">JadepotCEX</h2>
        </div>
        <div className="p-12 bg-secondary1 rounded-md shadow-md">
          <h2 className="text-2xl text-primary1 font-semibold mb-6">
            Sign in to your account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mt-1 mb-8">
              <label htmlFor="email" className="block text-text1 font-medium">
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email" // Added id attribute
                value={credentials.email}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="email" // Added autocomplete attribute
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-primary"
              />
            </div>
            <div className="mt-1 mb-8">
              <label htmlFor="password" className="block text-text1 font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password" // Added id attribute
                value={credentials.password}
                onChange={handleChange}
                disabled={isSubmitting}
                autoComplete="current-password" // Added autocomplete attribute
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-primary"
              />
            </div>
            {errors.message && (
              <div className="text-red-500 mb-4">{errors.message}</div>
            )}
            <button
              type="submit"
              disabled={isSubmitDisabled || isSubmitting}
              className={`bg-accent1 text-text1 font-medium py-2 px-4 rounded-md mt-2 w-full ${
                isSubmitDisabled || isSubmitting
                  ? "opacity-50 cursor-default"
                  : "hover:bg-accent1-dark"
              }`}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-text1">Dont have an account?</span>{" "}
            <Link to="/signup" className="text-primary1 hover:underline">
              Sign up now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

SignInForm.propTypes = {
  onSignIn: PropTypes.func.isRequired,
};

export default SignInForm;
