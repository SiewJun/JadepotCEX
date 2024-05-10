import React, { useState, useEffect } from "react"; // eslint-disable-line
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // State to track whether to show password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to track whether to show confirm password

  useEffect(() => {
    const handleResize = () => {
      setIsFeaturesVisible(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const isFormValid = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    setIsSubmitDisabled(!isFormValid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newErrors = {};
    // Validation logic...
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/signup",
        formData
      );
      setSuccessMessage(response.data.message);
      // Redirect to sign-in page upon successful submission
      navigate("/signin");
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        setErrors({ server: errorMessage });
      } else {
        setErrors({
          server: "An unexpected error occurred. Please try again later.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={`flex ${
          isFeaturesVisible ? "" : "justify-center"
        } max-w-3xl mt-8 mx-auto mb-8 p-0`}
      >
        {isFeaturesVisible && (
          <div className="max-w-xs p-12 bg-transparent border-2 border-secondary1 rounded-l-md">
            <ul>
              <img
                src="/src/assets/jadepotlogo.png"
                alt="Jadepot Logo"
                className="mb-8 h-16 w-16"
              />
              <li className="text-text1 mb-2">
                <strong>Market Overview:</strong>{" "}
                <p className="font-light">
                  Provide a quick overview of the current market.{" "}
                </p>
              </li>
              <br />
              <li className="text-text1 mb-2">
                <strong>Advanced Charting Tools:</strong>{" "}
                <p className="font-light">
                  Provide advanced charting tools that allow users to perform
                  technical analysis.{" "}
                </p>
              </li>
              <br />
              <li className="text-text1 mb-2">
                <strong>Wallet Management:</strong>{" "}
                <p className="font-light">
                  Enables you to manage your trading portfolios.{" "}
                </p>
              </li>
            </ul>
          </div>
        )}
        <div
          className={`max-w-xl p-12 bg-secondary1 ${
            isFeaturesVisible ? "rounded-r-md" : "rounded-md"
          } shadow-2xl`}
        >
          <h2 className="text-2xl text-primary1 font-bold mb-6">
            Create your JadepotCEX account
          </h2>
          {errors.server && (
            <div className="text-red-500 mb-4">{errors.server}</div>
          )}
          {successMessage && (
            <div className="text-green-500 mb-4">{successMessage}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="username"
                className="block text-text1 font-medium"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                className="form-input mt-1 p-1 w-full rounded-md border focus:border-primary1"
              />
              {errors.username && (
                <div className="text-red-500">{errors.username}</div>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-text1 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className="form-input mt-1 p-1 w-full rounded-md border focus:border-primary1"
              />
              {errors.email && (
                <div className="text-red-500">{errors.email}</div>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-text1 font-medium"
              >
                Create password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="form-input mt-1 p-1 w-full rounded-md border focus:border-primary1"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12a3 3 0 016 0m-6 0a3 3 0 016 0m-6 0a3 3 0 016 0m-6 0a3 3 0 016 0m-6 0a3 3 0 016 0"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="text-red-500">{errors.password}</div>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-text1 font-medium"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="form-input mt-1 p-1 w-full rounded-md border focus:border-primary1"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12a3 3 0 016 0m-6 0a3 3 0 016 0m-6 0a3 3 0 016 0m-6 0a3 3 0 016 0m-6 0a3 3 0 016 0"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="text-red-500">{errors.confirmPassword}</div>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="phone" className="block text-text1 font-medium">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                className="form-input mt-1 p-1 w-full rounded-md border focus:border-primary1"
              />
              {errors.phone && (
                <div className="text-red-500">{errors.phone}</div>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitDisabled || isSubmitting}
              className={`bg-accent1 text-text1 font-medium py-2 px-4 rounded-md mt-2 w-full ${
                isSubmitDisabled || isSubmitting
                  ? "opacity-50 cursor-default"
                  : "hover:bg-accent1-dark"
              }`}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-text1">Already have an account?</span>{" "}
            <Link to="/signin" className="text-primary1 hover:underline">
              Sign in now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;
