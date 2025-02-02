import multer from "multer";
import path from "path";

// Configure Multer for local CSV uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save CSVs in 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// CSV file filter
const fileFilter = (req, file, cb) => {
  if (path.extname(file.originalname) !== ".csv") {
    return cb(new Error("Only CSV files are allowed"), false);
  }
  cb(null, true);
};

// Create multer instance for CSVs
const uploadCSV = multer({ storage, fileFilter });

export default uploadCSV;
