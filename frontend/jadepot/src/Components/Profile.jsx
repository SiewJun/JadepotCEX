import React, { useEffect, useState } from "react"; // eslint-disable-line
import axios from "axios";
import Loading from "./Loading";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    nric: "",
    address: "",
    profilePicture: null,
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
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

        const response = await axios.get(
          "http://localhost:3000/profile",
          config
        );
        setProfileData(response.data);

        // Initialize formData with existing profile data
        setFormData({
          fullName: response.data.userProfile.fullName,
          dob: response.data.userProfile.dob,
          nric: response.data.userProfile.nric,
          address: response.data.userProfile.address,
          username: response.data.userDetails.username,
          email: response.data.userDetails.email,
          password: "", // You may not want to pre-fill the password field
          confirmPassword: "", // Reset confirm password field
          phone: response.data.userDetails.phone,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Reset password error when user types in the password fields
    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePicture: e.target.files[0], // Store the selected file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        console.error("Authentication token not found.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const formDataToSend = new FormData();
      for (const key in formData) {
        // Check if dob is empty and set it to null
        if (key === "dob" && !formData[key]) {
          formDataToSend.append(key, ""); // or null
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      await axios.put("http://localhost:3000/profile", formDataToSend, config);
      setEditing(false);

      // Reload the page after successful submission
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const validatePassword = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  // Function to convert timestamp string to a readable date format
  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "";
    }
    const date = new Date(timestamp);
    const options = { month: "short", day: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div>
      {loading ? (
        <Loading message="Loading profile..." />
      ) : profileData ? (
        <div className="container grid md:grid-cols-3 my-10 gap-3 mx-auto">
          <div className="md:col-span-1 p-8 bg-background2 rounded-lg shadow-md dark:border-2 dark:border-gray-600 flex flex-col items-center justify-center">
            {profileData.userProfile.profilePhotoPath ? (
              <img
                src={`http://localhost:3000/${profileData.userProfile.profilePhotoPath}`}
                alt="Profile"
                className="w-32 h-32 rounded-full mb-4 border-4 border-primary1 shadow-lg"
              />
            ) : (
              <img
                src={"http://localhost:3000/uploads/default.jpg"}
                alt="Default Profile"
                className="w-32 h-32 rounded-full mb-4 border-4 border-primary1 shadow-lg"
              />
            )}
            <p className="bg-gradient-to-r text-xl from-blue-500 to-indigo-500 text-transparent bg-clip-text text-center font-bold">
              {profileData.userDetails.username}
            </p>
            <p className="text-primary1 text-center mb-0">Since: </p>
            <p className="text-text1 text-center font-semibold">
              {formatDate(profileData.userProfile.createdAt)}
            </p>
          </div>
          <div className="md:col-span-2 p-8 bg-background2 rounded-lg shadow-md dark:border-2 dark:border-gray-600">
            {editing ? (
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-primary1 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={formData.fullName || ""}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="form-control"
                    autoComplete="name"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium text-primary1 mb-1"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    id="dob"
                    value={formData.dob || ""}
                    onChange={handleInputChange}
                    placeholder="Date of Birth"
                    className="form-control"
                    autoComplete="off"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="nric"
                    className="block text-sm font-medium text-primary1 mb-1"
                  >
                    NRIC
                  </label>
                  <input
                    type="text"
                    name="nric"
                    id="nric"
                    value={formData.nric || ""}
                    onChange={handleInputChange}
                    placeholder="NRIC"
                    className="form-control"
                    autoComplete="off"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-primary1 mb-1"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    placeholder="Address"
                    className="form-control"
                    autoComplete="off"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-primary1 mb-1"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    className="form-control"
                    autoComplete="name"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-primary1 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="form-control"
                    autoComplete="email"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-primary1 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={validatePassword}
                    placeholder="Password"
                    className="form-control"
                    autoComplete="current-password"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-primary1 mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={validatePassword}
                    placeholder="Confirm Password"
                    className="form-control"
                    autoComplete="current-password"
                  />
                  {passwordError && (
                    <p className="text-red-500">{passwordError}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-primary1 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number"
                    className="form-control"
                    autoComplete="tel"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="profilePicture"
                    className="block text-sm font-medium text-primary1 hover:animate mb-1"
                  >
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    name="profilePicture"
                    id="profilePicture"
                    onChange={handleFileChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <button
                    type="submit"
                    className="bg-secondary1 hover:bg-accent1 text-text1 py-2 px-4 rounded-md font-medium mr-3"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col">
                <h2 className="text-3xl font-bold mb-4 text-primary1">Profile</h2>
                <div className="mb-5">
                  <p className="text-primary1">
                    Email:{" "}
                    <span className="font-semibold text-text1">
                      {profileData.userDetails.email}
                    </span>
                  </p>
                  <p className="text-primary1">
                    NRIC:{" "}
                    <span className="font-semibold text-text1">
                      {profileData.userProfile.nric}
                    </span>
                  </p>
                  <p className="text-primary1">
                    Full Name:{" "}
                    <span className="font-semibold text-text1">
                      {profileData.userProfile
                        ? profileData.userProfile.fullName
                        : "N/A"}
                    </span>
                  </p>
                  <p className="text-primary1">
                    Date Of Birth:{" "}
                    <span className="font-semibold text-text1">
                      {formatDate(profileData.userProfile.dob)}
                    </span>
                  </p>
                  <p className="text-primary1">
                    Phone Number:{" "}
                    <span className="font-semibold text-text1">
                      {profileData.userDetails.phone}
                    </span>
                  </p>
                  <p className="text-primary1">
                    Address:{" "}
                    <span className="font-semibold text-text1">
                      {profileData.userProfile.address}
                    </span>
                  </p>
                  {/* Add more profile information here */}
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center space-x-2 bg-secondary1 hover:bg-accent1 text-text1 py-2 px-2 rounded-md font-medium self-end"
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
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="container mx-auto mt-9">
          <p className="text-red-500">Profile data not found</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
