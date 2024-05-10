const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../multerConfig'); // Import multer configuration

const router = express.Router();

// Authentication routes
router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);

// Protected route for viewing profile
router.get('/profile', authMiddleware, userController.viewProfile);

// Protected route for editing profile with multer middleware for file upload
router.put('/profile', authMiddleware, upload.single('profilePicture'), userController.editProfile);

module.exports = router;
