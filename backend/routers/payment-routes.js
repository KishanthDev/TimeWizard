import express from "express"
import paymentController from "../controllers/payment-controller.js"
import auth from "../middleware/auth.js"
const router = express.Router()

router.post("/subscribe",auth,paymentController.createCheckoutSession)
router.post(
    "/webhooks",
    express.raw({ type: "application/json" }),
    paymentController.webhooks
  );
  
router.get("/subscribe",paymentController.fetchSubscriptionStatus)

export default router