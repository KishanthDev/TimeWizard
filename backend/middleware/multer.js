import multer from "multer";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "project_documents",
    allowed_formats : ['pdf', 'jpg', 'png'],
    resource_type: "auto",
  },
});

const upload = multer({ storage });

export default upload;
