import userModel from "../modules/User.js";
import bcrypt from "bcrypt";
import validator from 'validator'
import cloudinary from '../config/cloudinary.js'
  import jwt from 'jsonwebtoken';

// Token generator
const createtoken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check for admin login
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = createtoken({ role: "admin" });
      return res.json({ success: true, token, isAdmin: true });
    }

    // ✅ Normal user login
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, mssg: "User not found" });
    }

    const ismatch = await bcrypt.compare(password, user.password);
    if (ismatch) {
      const token = createtoken({ id: user._id });
      return res.json({ success: true, token, isAdmin: false });
    } else {
      return res.json({ success: false, mssg: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, mssg: error.message });
  }
};


export const registerUser = async (req, res) => {
 try {
    const {fullName,email,password}=req.body
  const exist=await userModel.findOne({email})

   if(exist){
        return res.json({success:false,mssg:"User already exist"})
    }
    if(!validator.isEmail(email)){
        return res.json({success:false,mssg:"Please enter a valid email"})
    }

    if(password.length<8){
        return res.json({success:false,mssg:"Please enter strong password"})
    }

    //hasing password

    const saltrounds=await bcrypt.genSalt(10)
    const hashedpass=await bcrypt.hash(password,saltrounds)

    const newuser=new userModel({
      fullName,email,password:hashedpass
    })

    const user=await newuser.save()
   const token = createtoken({ id: user._id });

    res.json({
    success:true,token
})
 } catch (error) {
   console.log(error)
   res.json({
        success:false,mssg:error.message
     })
 }
};

export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

//controller to update profile for users
export const updateProfile = async (req, res) => {
  try {
    const {fullName, profilePic}=req.body;
     const userId=req.user._id
   let updatedUser

   if(!profilePic){//only change the name
    updatedUser=await userModel.findByIdAndUpdate(userId,{fullName},{new:true})
   }else{
    const upload=await cloudinary.uploader.upload(profilePic)
    updatedUser=await userModel.findByIdAndUpdate(userId,{fullName,profilePic:upload.secure_url},{new:true})
   }
   res.json({success:true,user:updatedUser})
  } catch (error) {
   console.log(error)
    res.json({success:false,mssg:error.message})
  }
}

