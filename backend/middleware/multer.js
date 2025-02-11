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

const taskStorage = new CloudinaryStorage({
  cloudinary:cloudinary,
  params:{
    folder:"task_documents",
    resource_type:"auto"
  }
})

export const upload = multer({ storage });

export const taskUpload = multer({storage:taskStorage})
