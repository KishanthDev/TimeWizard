import express from "express"
import projectCntrl from "../controllers/project-controller.js"
import  uploadFile  from "../middleware/attachment-upload.js"

const router = express.Router()

router.post("/create",uploadFile,projectCntrl.createProject)


export default router