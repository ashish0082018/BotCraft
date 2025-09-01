import Razorpay from "razorpay";
import crypto from "crypto";
import prisma from "../config/database.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_ID
});

export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        
        if (!amount) {
            return res.status(400).json({ 
                success: false, 
                message: "Amount is required" 
            });
        }

        const order = await razorpay.orders.create({
            amount: amount,
            currency: "INR",
            receipt: `order_${Date.now()}`
        });

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to create order" 
        });
    }
};

export const verifyOrder = async (req, res) => {
    try {
        const { orderId, razorpayPaymentId, razorpaySignature } = req.body;
        const userId = req.id; // From authentication middleware

        if (!orderId || !razorpayPaymentId || !razorpaySignature) {
            return res.status(400).json({
                success: false,
                message: "Missing required payment details"
            });
        }

        // Generate signature for verification
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET_ID)
            .update(orderId + "|" + razorpayPaymentId)
            .digest("hex");

        // Verify signature
        if (generatedSignature !== razorpaySignature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        // Verify payment with Razorpay
        try {
            const payment = await razorpay.payments.fetch(razorpayPaymentId);
            
            if (payment.status === 'captured') {
                // Payment successful - update user plan
                const updatedUser = await prisma.user.update({
                    where: { id: userId },
                    data: {
                        plan: 'PRO',
                        requestsLeft: 15000 // Pro plan limit
                    }
                });

                // Create payment record
                await prisma.payment.create({
                    data: {
                        razorpayId: razorpayPaymentId,
                        amount: payment.amount / 100, // Convert from paise to rupees
                        status: 'SUCCESS',
                        userId: userId
                    }
                });

                res.status(200).json({
                    success: true,
                    message: "Payment verified successfully",
                    data: {
                        plan: 'PRO',
                        requestsLeft: 15000
                    }
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Payment not completed"
                });
            }
        } catch (razorpayError) {
            console.error("Razorpay payment fetch error:", razorpayError);
            res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

    } catch (error) {
        console.error("Error verifying order:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



export const getKey = (req, res) => {
    try {
        // Sirf public KEY_ID bhej rahe hain, SECRET nahi.
        res.status(200).json({ success: true, key: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};