import express from "express"
import chatController from "../controllers/chat-controller.js"
import idValidation from "../validators/id-validation.js"
import { checkSchema } from "express-validator"

const router = express.Router()

router.get("/project/:id",checkSchema(idValidation),chatController.get)

export default router