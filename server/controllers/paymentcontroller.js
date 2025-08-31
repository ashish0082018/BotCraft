import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_ID
    });

export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        const order = await razorpay.orders.create({
            amount: amount,
            currency: "INR"
        });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}