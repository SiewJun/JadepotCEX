const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

exports.signUp = async (req, res, next) => {
  try {
    const { username, email, password, phone } = req.body;

    // Check if any required field is missing or empty
    if (!username || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if the email is already registered
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Check if the username is already taken
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username is not available' });
    }

    // Check if the phone number is already registered
    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({ message: 'Phone number is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with hashed password
    const newUser = await User.create({ username, email, password: hashedPassword, phone });

    // Create a profile for the new user
    await UserProfile.create({ userId: newUser.id, fullName: username });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Determine the user's role (you might have a way to retrieve it from your database)
    const userRole = user.role; // Adjust this according to your data model

    // Generate a JWT token for the user including the user ID and role
    const token = jwt.sign({ userId: user.id, username: user.username, role: userRole }, process.env.JWT_SECRET, {
      expiresIn: '1h' // Token expires in 1 hour
    });

    // Return the token as part of the response
    res.status(200).json({ message: 'Sign-in successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.viewProfile = async (req, res, next) => {
  try {
    // Retrieve user information from req.user (attached by authMiddleware)
    const user = req.user;

    // Fetch user's profile information from the database 
    const userProfile = await UserProfile.findOne({ where: { userId: user.userId } });

    // Fetch user's information from the User table
    const userDetails = await User.findOne({ where: { id: user.userId } });

    if (!userProfile || !userDetails) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json({ userProfile, userDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.editProfile = async (req, res, next) => {
  try {
    // Retrieve user information from req.user (attached by authMiddleware)
    const user = req.user;

    // Retrieve profile data from the request body
    const { fullName, dob, nric, address, username, email, password, phone } = req.body;

    // Find the user's profile
    let userProfile = await UserProfile.findOne({ where: { userId: user.userId } });

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Handle profile picture upload
    if (req.file) {
      // Get the path where multer saved the file
      let profilePhotoPath = req.file.path;

      // Replace backslashes with forward slashes in the path
      profilePhotoPath = profilePhotoPath.replace(/\\/g, '/');

      // Update the profilePhotoPath field in the user profile
      userProfile.profilePhotoPath = profilePhotoPath;
    }

    // Update the profile information
    userProfile.fullName = fullName;
    userProfile.dob = dob || null; // Handle empty dob field
    userProfile.nric = nric;
    userProfile.address = address;

    // Save the updated profile information
    await userProfile.save();

    // Find the user
    let updatedUser = await User.findOne({ where: { id: user.userId } });

    // Update the user information if provided in the request
    if (username) updatedUser.username = username;
    if (email) updatedUser.email = email;
    if (password) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedUser.password = hashedPassword;
    }
    if (phone) updatedUser.phone = phone;

    // Save the updated user information
    await updatedUser.save();

    // Fetch updated user's profile information
    userProfile = await UserProfile.findOne({ where: { userId: user.userId } });

    res.status(200).json({ message: 'Profile updated successfully', userProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};