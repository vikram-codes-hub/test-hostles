import mongoose from 'mongoose'

const userschema=new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    fullName:{type:String,required:true},
    password:{type:String,required:true,minlength:6},
    profilePic: { type: String },
    bio:{ type: String, default: "" },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, 
},{timestamps:true})

const userModel=mongoose.model("User",userschema)

export default userModel