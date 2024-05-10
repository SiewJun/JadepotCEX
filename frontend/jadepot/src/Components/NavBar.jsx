import React, { useState, useEffect, useRef } from "react"; // eslint-disable-line
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import MobileOffcanvas from "./MobileOffcanvas";

const Navbar = () => {
  const [prefersDarkMode, setPrefersDarkMode] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Check if user prefers dark mode
  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setPrefersDarkMode(darkModeQuery.matches);
    darkModeQuery.addEventListener("change", handleDarkModeChange);
    return () => {
      darkModeQuery.removeEventListener("change", handleDarkModeChange);
    };
  }, []);

  const handleDarkModeChange = (event) => {
    setPrefersDarkMode(event.matches);
  };

  const handleLogout = () => {
    // Clear authentication token from local storage
    localStorage.removeItem("authToken");
    // Update authentication status and navigate to sign-in page
    navigate("/signin");
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken);
        const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds

        if (expirationTime < Date.now()) {
          // Token has expired, remove it from local storage
          localStorage.removeItem("authToken");
          // Optionally, you can also redirect the user to the login page
          // or show a message indicating that the session has expired.
        } else {
          // Token is still valid, extract user role and username
          const role = decodedToken.role;
          const username = decodedToken.username;
          setUserRole(role);
          setUserName(username);
        }
      } catch (error) {
        // Handle invalid or malformed tokens (e.g., clear local storage)
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  return (
    <>
      <div className="bg-secondary1">
        <div className="container mx-auto px-0">
          {/* Top Navbar */}
          <div className="container mx-auto py-2">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center"
                style={{ textDecoration: "none" }}
              >
                <img
                  src={
                    prefersDarkMode
                      ? "../src/assets/jadepotlogo.png"
                      : "../src/assets/jadepotlogo1.png"
                  }
                  alt="Logo"
                  className="h-8 mr-2"
                />
                <span className="text-text1 text-lg font-semibold truncate sm:max-w-none">
                  JadepotCEX
                </span>
              </Link>

              {/* Account Links */}
              <div className="flex justify-end items-center">
                <MobileOffcanvas userRole={userRole} userName={userName} />
                <div className="d-none d-lg-flex hidden md:flex">
                  <button
                    className="dropdown-toggle px-3 py-2 text-text1 hover:text-accent1"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                      />
                    </svg>
                  </button>
                  <div>
                    <ul
                      className="dropdown-menu dropdown-menu-end border"
                      style={{ backgroundColor: "var(--background1)" }}
                    >
                      <li>
                        <button
                          onClick={() => navigate("/trading")}
                          className="flex text-right text-text1 hover:text-accent1 px-4 py-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                          Trading
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => navigate("/p2p")}
                          className="flex text-right text-text1 hover:text-accent1 px-4 py-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 mr-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                            />
                          </svg>
                          P2P
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="flex items-center hover:text-accent1 justify-center h-full text-text1 pl-4 py-2">
                    <button
                      className="flex dropdown-toggle text-text1 hover:text-accent1 justify-center items-center"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {userRole === "user" ? (
                        <span>{userName}</span>
                      ) : (
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        </span>
                      )}
                    </button>
                    {userRole !== "user" && (
                      <ul
                        className="dropdown-menu border"
                        style={{ backgroundColor: "var(--background1)" }}
                      >
                        <li>
                          <button
                            onClick={() => navigate("/signin")}
                            className="flex px-4 py-2 text-text1 hover:text-accent1 w-full text-left"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 mr-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                              />
                            </svg>
                            Sign In
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => navigate("/signup")}
                            className="flex px-4 py-2 text-text1 hover:text-accent1 w-full text-left"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 mr-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                            Sign Up
                          </button>
                        </li>
                      </ul>
                    )}
                    {userRole === "user" && (
                      <ul
                        className="dropdown-menu border"
                        style={{ backgroundColor: "var(--background1)" }}
                      >
                        <li>
                          <button
                            onClick={() => navigate("/profile")}
                            className="flex px-4 py-2 text-text1 hover:text-accent1 w-full text-left"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 mr-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                              />
                            </svg>
                            Profile
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => navigate("/wallet")}
                            className="flex px-4 py-2 text-text1 hover:text-accent1 w-full text-left"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 mr-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                              />
                            </svg>
                            Assets
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => navigate("/support")}
                            className="flex px-4 py-2 text-text1 hover:text-accent1 w-full text-left"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 mr-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                              />
                            </svg>
                            Support
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="flex px-4 py-2 text-text1 hover:text-accent1 w-full text-left"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 mr-2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                              />
                            </svg>
                            Logout
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
