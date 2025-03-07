import express, { Router } from "express"
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
router.put("/:taskId",taskController.updateTaskDetails)

router.put("/completeTask/:taskId",taskUpload.array("attachments"),taskVerifyController.submitTask)
router.put("/approveTask/:taskId",taskVerifyController.approveTask)
router.put("/revision/:taskId",taskVerifyController.requestRevision)
router.put("/update/:taskId",taskVerifyController.updateTaskStatus)


export default router