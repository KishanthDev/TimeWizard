import express from "express"
import projectCntrl from "../controllers/project-controller.js"
import  uploadFile  from "../middleware/attachment-upload.js"
import auth from "../middleware/auth.js"

const router = express.Router()

router.post("/create",auth,uploadFile,projectCntrl.createProject)
router.get("/get",auth,projectCntrl.get)

export default router