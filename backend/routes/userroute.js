import express from 'express'
const userRouter=express.Router();

import { isLoggedin } from '../middelwares/auth.js';
import { checkAuth,login ,registerAdmin,registerUser,updateProfile } from '../controller/Usercontroller.js';


userRouter.post('/login',login)
userRouter.post('/signup',registerUser)
userRouter.post('/registeradmin',registerAdmin)
userRouter.put('/update-profile',isLoggedin,updateProfile)
userRouter.get('/check',isLoggedin,checkAuth)

export default userRouter