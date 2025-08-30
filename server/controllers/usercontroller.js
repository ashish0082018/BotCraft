

import prisma from "../config/database.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config()

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body);
        
        if (!name || !email || !password) {
            return res.status(401).json({
                message: "Fill the details",
                success: false,
            });
        }

        const userAlreadyExists = await prisma.user.findUnique({
            where:{ email:email }
        })
        if (userAlreadyExists) {
            return res.status(401).json({
                message: "User already exists",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data:{
                name, email,
                password: hashedPassword,
            }
        })

        const token = jwt.sign({ userid: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 });
        return res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                id: user.id,
            },
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }

}


export  const signIn=async (req,res)=>{
    try{
        const {email,password} =req.body;
        if(!email || !password){
            return res.status(401).json({
                message:"Fill the details",
                success:false
            })
          }
        
        // lets find the user 
        const loginuser= await prisma.user.findUnique({where:{email:email}})
        if(!loginuser) return res.status(401).json({
            message:"Incorrect email or password",
            success:false
        })
        
        const matchingPassword= await bcrypt.compare(password,loginuser.password)
        
        if(!matchingPassword){
            return res.status(401).json({
                message:"Incorrect email or password",
                success:false
            })
        }
        
        
        
        const token= jwt.sign({userid:loginuser.id},process.env.JWT_SECRET,{expiresIn:'1d'})
        return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({    
          success:true,
           user:{
            name:loginuser.name,
            email:loginuser.email,
            id:loginuser.id
           },
         
        }) 
        
            }
            catch(error){
                console.log(error);
                
            }
}