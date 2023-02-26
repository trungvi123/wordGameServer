import express from "express"
import {checkAccessToken} from '../middleware/authMiddleware.js'
import {signIn,signUp,refreshTokeMethod} from "../controllers/authController.js"


const router = express.Router()


router.post('/signIn',signIn)
router.post('/signUp',signUp)
router.get('/refreshToken',refreshTokeMethod)


export default router