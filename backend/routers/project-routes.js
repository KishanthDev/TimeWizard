import express from "express"
import projectCntrl from "../controllers/project-controller.js"
import auth from "../middleware/auth.js"
import authorizeUser from "../middleware/authorizeUser.js"
import upload from "../middleware/multer.js"

const router = express.Router()

router.post("/create",auth,authorizeUser(["admin"]),upload.array("projectDocuments"),projectCntrl.createProject)
router.get("/get",authorizeUser(["admin"]),projectCntrl.get)

export default router