import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Set the upload path for files
const uploadPath = path.join(process.cwd(), 'uploads');

// Create 'uploads' folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

const uploadFile = (req, res, next) => {
  upload.array('files')(req, res, (err) => {
    if (err) {
      console.error('File Upload Error:', err.message);
      return res.status(500).json({ message: 'Error uploading file', error: err.message });
    }
    if (!req.files) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    next(); 
  });
};

export default uploadFile;
