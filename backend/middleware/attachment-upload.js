import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Function to initialize upload path and storage configuration
const getMulterUpload = (folderName, allowedFormats = []) => {
  // Set the upload path dynamically based on folderName
  const uploadPath = path.join(process.cwd(), 'uploads', folderName);

  // Create folder if it doesn't exist
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    if (!allowedFormats.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only images are allowed.'));
    }
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
  });
};

const uploadFile = (fieldName, folderName, multiple = false, allowedFormats = []) => {
  const upload = getMulterUpload(folderName, allowedFormats);

  return (req, res, next) => {
    const uploadHandler = multiple
      ? upload.array(fieldName)  // For multiple files
      : upload.single(fieldName); // For a single file

    uploadHandler(req, res, (err) => {
      if (err) {
        console.error('File Upload Error:', err.message);
        return res.status(500).json({ message: 'Error uploading file', error: err.message });
      }
      if (multiple && (!req.files || req.files.length === 0)) {
        return res.status(400).json({ message: 'No files uploaded' });
      }
      if (!multiple && !req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      next();
    });
  };
};

export default uploadFile;
