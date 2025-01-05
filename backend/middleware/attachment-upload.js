import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Set the upload path for files
const uploadPath = path.join(process.cwd(), 'uploads');

// Create 'uploads' folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Set up multer for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);  // Store files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Ensure unique filenames
  }
});

const upload = multer({ storage: storage });

const uploadFile = (req, res, next) => {
  upload.array('files')(req, res, (err) => {  // Handle single file upload
    if (err) {
      console.error('File Upload Error:', err.message);
      return res.status(500).json({ message: 'Error uploading file', error: err.message });
    }
    if (!req.files) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log('this Uploaded File:', req.files);  // Log the uploaded file details
    next(); // Proceed to the next middleware or route handler
  });
};

export default uploadFile;
