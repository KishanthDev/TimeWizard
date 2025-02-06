import express from "express"
import taskController from "../controllers/task-controller.js"
import auth from "../middleware/auth.js"
import authorizeUser from "../middleware/authorizeUser.js"
const router = express.Router()


router.post("/create/:userId",auth,authorizeUser(["admin"]),taskController.createTask)
router.post("/clockIn/:taskId",taskController.clockIn)
router.post("/clockOut/:taskId",taskController.clockOut)
router.get("/get",auth,taskController.get)
router.put("/completeTask/:taskId",taskController.completeTask)
router.get("/:projectId/:employeeId",taskController.getEmployeeTasksForProject)
router.get("/getAll",taskController.getAll)

export default router