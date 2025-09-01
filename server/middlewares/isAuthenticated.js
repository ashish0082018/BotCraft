import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()


const isauthenticated= async (req,res,next)=>{
    try{
    const token=req.cookies.token
    if(!token) return res.status(401).json({
        message:"Please Login Yourself..!!",
        success:false
    })


    const decode = jwt.verify(token,process.env.JWT_SECRET);
    if(!decode){
        return res.status(401).json({
            message:"Invalid",
            success:false
        })
    }
    
req.id=decode.userid

next();

    }
    catch(error){
        console.log(error);
        
    }
}
export  default isauthenticated