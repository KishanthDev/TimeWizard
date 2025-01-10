import express from "express"
const router = express.Router()
import userCnrtl from "../controllers/user-controller.js"
import { loginUserValidation, registerUserValidation } from "../validators/user-validation.js"
import { checkSchema } from "express-validator"
import auth from "../middleware/auth.js"
import userPassCntrl from "../controllers/user-pass-controller.js"
import authorizeUser from "../middleware/authorizeUser.js"


router.post("/signup",checkSchema(registerUserValidation),userCnrtl.signup)
router.post("/verifyOtp",userCnrtl.verifyOtp)
router.post("/login",checkSchema(loginUserValidation),userCnrtl.login)
router.get("/profile",auth,userCnrtl.profile)
router.put("/approve/:userId",auth,authorizeUser(["admin"]),userCnrtl.verifyUser)
router.get("/get",auth,userCnrtl.get)
router.post("/forgotPassword",userPassCntrl.forgotPassword)
router.post("/verifyOtpAndResetPassword",userPassCntrl.verifyOtpAndResetPassword)
router.post("/resetPassword",userPassCntrl.resetPassword)

export default router