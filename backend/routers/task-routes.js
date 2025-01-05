import express from "express"
import taskController from "../controllers/task-controller.js"
import auth from "../middleware/auth.js"
const router = express.Router()


router.post("/create/:userId",auth,taskController.createTask)
router.post("/clockIn/:taskId",taskController.clockIn)
router.post("/clockOut/:taskId",taskController.clockOut)
router.get("/totalTime/:taskId",taskController.getTotalTimeSpent)

export default router