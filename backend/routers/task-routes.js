import express from "express"
import taskController from "../controllers/task-controller.js"
import auth from "../middleware/auth.js"
import authorizeUser from "../middleware/authorizeUser.js"
import { taskUpload } from "../middleware/multer.js"
import taskVerifyController from "../controllers/task-verify-controller.js"
const router = express.Router()


router.post("/create/:userId",auth,authorizeUser(["admin"]),taskController.createTask)
router.post("/clockIn/:taskId",taskController.clockIn)
router.post("/clockOut/:taskId",taskController.clockOut)
router.get("/get",auth,taskController.get)
router.get("/:projectId/:employeeId",taskController.getEmployeeTasksForProject)
router.get("/getAll",auth,taskController.getAll)

router.put("/completeTask/:taskId",taskUpload.array("attachments"),taskVerifyController.submitTask)
router.put("/approveTask/:taskId",taskVerifyController.approveTask)
router.put("/revison/:taskId",taskVerifyController.requestRevision)

export default router