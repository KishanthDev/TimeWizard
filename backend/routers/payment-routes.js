import express from "express"
import paymentController from "../controllers/payment-controller.js"
import auth from "../middleware/auth.js"
const router = express.Router()

router.post("/subscribe",auth,paymentController.createCheckoutSession)
router.put("/success",auth,paymentController.success)
router.get("/subscribe",auth,paymentController.fetchSubscriptionStatus)

export default router