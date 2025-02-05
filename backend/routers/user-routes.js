import express from "express"
const router = express.Router()
import userCnrtl from "../controllers/user-controller.js"
import { loginUserValidation, registerUserValidation } from "../validators/user-validation.js"
import { checkSchema } from "express-validator"
import auth from "../middleware/auth.js"
import userPassCntrl from "../controllers/user-pass-controller.js"
import upload from "../middleware/multer.js"
import uploadCSV from "../middleware/multerCSV.js"
import authorizeUser from "../middleware/authorizeUser.js"


router.post("/create",checkSchema(registerUserValidation),userCnrtl.signup)
router.post("/login",checkSchema(loginUserValidation),userCnrtl.login)
router.post("/import-csv",uploadCSV.single("file"),userCnrtl.importUsersFromCSV)
router.get("/profile",auth,userCnrtl.profile)
router.get("/get",auth,userCnrtl.get)
router.post("/forgotPassword",userPassCntrl.forgotPassword)
router.post("/verifyOtpAndResetPassword",userPassCntrl.verifyOtpAndResetPassword)
router.post("/resetPassword",userPassCntrl.resetPassword)
router.put("/:id/edit",upload.single("profileImage"),userCnrtl.edit) 
router.delete("/:id/remove",auth,authorizeUser(["admin"]),userCnrtl.remove)

export default router