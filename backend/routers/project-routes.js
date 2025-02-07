import express from "express"
import projectCntrl from "../controllers/project-controller.js"
import auth from "../middleware/auth.js"
import authorizeUser from "../middleware/authorizeUser.js"
import upload from "../middleware/multer.js"

const router = express.Router()

router.post("/create",auth,authorizeUser(["admin"]),upload.array("attachments"),projectCntrl.createProject)
router.delete("/:id/remove",auth,authorizeUser(["admin"]),projectCntrl.remove)
router.get("/get",auth,authorizeUser(["admin"]),projectCntrl.get)
router.get("/:id/get",projectCntrl.getById)

export default router