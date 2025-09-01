

import prisma from "../config/database.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config()



const fetchUserDashboardData = async (userId) => {
    try {
        const userStats = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                plan: true,
                requestsLeft: true,
                createdAt: true,
                _count: {
                    select: { bots: true }
                },
                bots: {
                    select: { id: true, name: true, createdAt: true },
                    orderBy: { createdAt: 'desc' }
                },
                payments: {
                    where: { status: 'SUCCESS' },
                    select: { id: true, razorpayId: true, amount: true, status: true, createdAt: true },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!userStats) return null;

        // Plan limits yahan define karein
        const planLimits = {
            FREE: { botsLimit: 2, requestsLimit: 100 },
            PRO: { botsLimit: 10, requestsLimit: 1000 }
        };

        const currentPlan = planLimits[userStats.plan] || planLimits.FREE;

        // Final dashboard object prepare karein
        const dashboardData = {
            profile: {
                id: userStats.id,
                name: userStats.name,
                email: userStats.email,
                memberSince: userStats.createdAt
            },
            plan: {
                currentPlan: userStats.plan,
                requestsLeft: userStats.requestsLeft,
                requestsLimit: currentPlan.requestsLimit,
            },
            stats: {
                totalBots: userStats._count.bots,
                botsLimit: currentPlan.botsLimit,
            },
            bots: userStats.bots,
            paymentHistory: userStats.payments
        };

        return dashboardData;
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw new Error("Could not fetch user dashboard data.");
    }
};


export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
       
        
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
        const dashboardData = await fetchUserDashboardData(user.id);
        const token = jwt.sign({ userid: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 });
      
       
        return res.status(200).json({
            dashboardData,
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
        
        const dashboardData = await fetchUserDashboardData(loginuser.id);
        
        const token= jwt.sign({userid:loginuser.id},process.env.JWT_SECRET,{expiresIn:'1d'})
      
        return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({    
          success:true,
          dashboardData
         
        }) 
        
            }
            catch(error){
                console.log(error);
                
            }
}




export const signOut=async(req,res)=>{
    try{
        res.clearCookie('token');
      res.json({
          message:"Logged Out Successfully",
          success:true
      })
    }
    catch(error){
      console.log(error);
    }
}


export const getUserData = async (req, res) => {
    try {
        const userId = req.id; // From JWT middleware
        const dashboardData = await fetchUserDashboardData(userId);

        if (!dashboardData) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        res.json({ success: true, data: dashboardData });

    } catch (error) {
        res.status(500).json({ message: "Server error", success: false });
    }
};













export const getUserStats = async (req, res) => {
    try {
        const userId = req.id; // From JWT middleware
        
        // Get user with bots count and other stats
        const userStats = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                plan: true,
                requestsLeft: true,
                createdAt: true,
                _count: {
                    select: {
                        bots: true,
                        payments: true
                    }
                },
                bots: {
                    select: {
                        id: true,
                        name: true,
                        createdAt: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                payments: {
                    where: {
                        status: 'SUCCESS'
                    },
                    select: {
                        amount: true,
                        createdAt: true
                    }
                }
            }
        });

        if (!userStats) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Calculate total spent
        const totalSpent = userStats.payments.reduce((sum, payment) => sum + payment.amount, 0);

        // Get plan limits
        const planLimits = {
            FREE: { botsLimit: 2, requestsLimit: 100 },
            PRO: { botsLimit: 10, requestsLimit: 1000 }
        };

        const currentPlan = planLimits[userStats.plan] || planLimits.FREE;

        const stats = {
            user: {
                id: userStats.id,
                name: userStats.name,
                email: userStats.email,
                plan: userStats.plan,
                requestsLeft: userStats.requestsLeft
            },
            stats: {
                botsCreated: userStats._count.bots,
                botsLimit: currentPlan.botsLimit,
                botsRemaining: currentPlan.botsLimit - userStats._count.bots,
                apiRequestsUsed: currentPlan.requestsLimit - userStats.requestsLeft,
                apiRequestsLimit: currentPlan.requestsLimit,
                totalSpent: totalSpent,
                memberSince: userStats.createdAt
            },
            recentBots: userStats.bots.slice(0, 5) // Last 5 bots
        };

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};