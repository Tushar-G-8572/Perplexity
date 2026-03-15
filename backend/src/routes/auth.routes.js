import express from 'express';
import { getMe, loginController, registerController, resendEmailVerificationController, verifyEmail } from '../controllers/auth.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';
import { registerValidator,loginValidation } from '../validators/auth.validator.js';

const authRouter = express.Router();

authRouter.post('/register',registerValidator,registerController);

authRouter.get('/verify-email',verifyEmail);

authRouter.post("/resend-email",resendEmailVerificationController);

authRouter.post('/login',loginValidation,loginController);

authRouter.get('/get-me',authUser,getMe);


export default authRouter;