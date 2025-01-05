import express from "express"
import projectCntrl from "../controllers/project-controller.js"
import  uploadFile  from "../middleware/attachment-upload.js"
import auth from "../middleware/auth.js"

const router = express.Router()

router.post("/create",auth,uploadFile,projectCntrl.createProject)


export default router