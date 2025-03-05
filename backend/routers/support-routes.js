import express from "express"
import supportController from "../controllers/support-controller.js"
import auth from "../middleware/auth.js"
const router = express.Router()

router.post("/contact",auth,supportController.contactForm)
router.get("/all-queries",supportController.allQueries)
router.post("/respond/:queryId", supportController.respondToQuery);
router.get("/my-queries",auth,supportController.getMyQueries)

export default router