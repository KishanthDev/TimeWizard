import express from "express"
import projectCntrl from "../controllers/project-controller.js"
import  uploadFile  from "../middleware/attachment-upload.js"
import auth from "../middleware/auth.js"
import authorizeUser from "../middleware/authorizeUser.js"

const router = express.Router()
const uploadProjectDocuments = uploadFile('files', 'projectDocuments', true,['image/jpeg', 'image/png','image/jpg'] )

router.post("/create",auth,authorizeUser(["admin"]),uploadProjectDocuments,projectCntrl.createProject)
router.get("/get",authorizeUser(["admin"]),projectCntrl.get)

export default router