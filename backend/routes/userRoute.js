import express from 'express';
import { loginUser, registerUser, adminLogin, getUserprofile, forgetPassword, resetPassword, createAdmin, verifyToken, getAllUsers, updateProfile, toggleUserStatus} from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';


const userRouter = express.Router();


userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/create-admin', createAdmin)
userRouter.post('/verify-token', verifyToken)
userRouter.post('/list', adminAuth, getAllUsers)
userRouter.post('/profile', authUser, getUserprofile)
userRouter.post('/update-profile', authUser, updateProfile)
userRouter.post('/toggle-status', adminAuth, toggleUserStatus)
userRouter.post('/forgot-password', forgetPassword)
userRouter.post('/reset-password',resetPassword)


export default userRouter;
