import activityLog from "../controllers/activity-controller.js";
import express from "express"
const router = express.Router()

router.get("/get",activityLog.get)

export default router