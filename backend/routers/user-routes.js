import express from "express"
const router = express.Router()
import userCnrtl from "../controllers/user-controller.js"
import { loginUserValidation, registerUserValidation } from "../validators/user-validation.js"
import { checkSchema } from "express-validator"
import auth from "../middleware/auth.js"

router.post("/register",checkSchema(registerUserValidation),userCnrtl.create)
router.post("/login",checkSchema(loginUserValidation),userCnrtl.login)
router.get("/profile",auth,userCnrtl.profile)
router.put("/approve/:userId",auth,userCnrtl.verifyUser)
router.get("/get",auth,userCnrtl.get)

export default router