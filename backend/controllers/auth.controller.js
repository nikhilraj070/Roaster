import User from "../models/user.model.js";
import { generateToken } from "../utils/genToken.js";
import {hashPassword,comparePassword} from "../utils/hashPassword.js"
import mongoose from "mongoose";

export const register =async (req , res )=>{
    try {
     const {username,password} = req.body;
     
     if(!username){
       return res.status(400).json({message:"Username is required"});
     }
     if(username.length < 3){
       return res.status(400).json({message:"Username must be 3 character long"});
     }
     if(!password || password.length < 6 ){
      return res.status(400).json({message:"Password must be 6 character long"})
     }
     console.log("Ready State:", mongoose.connection.readyState);
     const existUser = await User.findOne({username})
     if(existUser){
      return res.status(400).json({message:"User already exist"})
     }
     const hashedPassword = await hashPassword(password)
    
      const user =await User.create({
      username,password:hashedPassword
     })
     const token = generateToken(user._id)
     res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
     const userResponse = user.toObject();
     delete userResponse.password;
     return res.status(201).json({message:"user created successfully",user:userResponse})
     } catch (error) {
       return res.status(500).json({message:"Registration Error",error: error.message})
     }
    

   }


   export const login = async (req,res)=>{
    try {
      const {username , password} = req.body;
      if(!username){
        return res.status(400).json({message:"Username is required"});
      }
      if(!password || password.length < 6 ){
      return res.status(400).json({message:"Password must be 6 character long"})
     }
     const user = await User.findOne({username})
     
     if(!user){
      return res.status(400).json({message:"User Not Found"})
     }
     const verify = await comparePassword(password,user.password);
     if(!verify){
      return res.status(400).json({message:"Incorrect Paasword"})
     }
     const token = generateToken(user._id);
     res.cookie("token",token,{
      httpOnly:true,
      secure:false,
      sameSite:"lax",
      maxAge:7*24*60*60*1000
     })

    const userResponse = user.toObject();
     delete userResponse.password;
     return res.status(200).json({message:"Login successful",user:userResponse})
     } catch (error) {
       return res.status(500).json({message:"Login Error",error:error?.message})
     }
   }

   export const logout = (req,res)=>{
    try {
      res.clearCookie('token',{
         httpOnly: true,
      secure: false,
      sameSite: "lax"
      })
       return res.status(200).json({message:"Logout successful"})
    } catch (error) {
       return res.status(500).json({message:"Logout Error",error:error?.message})
    }
   }


   export const whoAmI  =(req , res)=>{
     res.status(200).json({success: true,
        user: req.user})
   }
