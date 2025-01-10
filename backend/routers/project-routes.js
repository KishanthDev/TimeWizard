import express from "express"
import projectCntrl from "../controllers/project-controller.js"
import  uploadFile  from "../middleware/attachment-upload.js"
import auth from "../middleware/auth.js"
import authorizeUser from "../middleware/authorizeUser.js"

const router = express.Router()

router.post("/create",auth,authorizeUser(["admin"]),uploadFile,projectCntrl.createProject)
router.get("/get",authorizeUser(["admin"]),projectCntrl.get)

export default router