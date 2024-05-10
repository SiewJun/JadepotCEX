const multer = require('multer');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Upload destination directory
  },
  filename: function (req, file, cb) {
    // Get the file extension
    const ext = file.originalname.split('.').pop();
    // Generate a unique filename with current timestamp
    const filename = `${file.originalname.split('.').slice(0, -1).join('.')}_${Date.now()}.${ext}`;
    cb(null, filename); // Use generated filename
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
