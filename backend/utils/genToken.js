import jwt from "jsonwebtoken";


export const generateToken =  (userId)=>{
  
   try {
    const response =  jwt.sign({id:userId},process.env.JWT_SECRET,{
        expiresIn:'7d',
    })
    return response
   } catch (error) {
    console.log("gen token error",error);
   }
}