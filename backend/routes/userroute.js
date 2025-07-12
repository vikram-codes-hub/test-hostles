import express from 'express'
const userRouter=express.Router();

import { isLoggedin } from '../middelwares/auth.js';
import { checkAuth,login ,registerUser,updateProfile } from '../controller/Usercontroller.js';


userRouter.post('/login',login)
userRouter.post('/signup',registerUser)
userRouter.put('/update-profile',isLoggedin,updateProfile)
userRouter.get('/check',isLoggedin,checkAuth)

export default userRouter