import express from "express"
import supportController from "../controllers/support-controller.js"
const router = express.Router()

router.post("/submit-contact-form",supportController.contactForm)
router.post("/submit-faq",supportController.faq)
router.get("/view-support-queries",supportController.allQueries)
router.get("/view-faq",supportController.getFaqs)


export default router