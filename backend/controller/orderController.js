import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import fs from "fs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "UserId is required" });
    }

    // Create a new order in the database (unpaid initially)
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false,
    });

    await newOrder.save();

    // Create a PaymentIntent for the amount
    // amount is passed in dollars, Stripe expects cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), 
      currency: "usd",
      metadata: { orderId: newOrder._id.toString() },
    });


    res.json({ 
      success: true, 
      clientSecret: paymentIntent.client_secret,
      orderId: newOrder._id
    });
  } catch (error) {
    console.error("Order placement error details:", error);
    res.status(500).json({ success: false, message: error.message || "Order Failed" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  const logMessage = `[${new Date().toISOString()}] Verify Attempt - ID: ${orderId}, Success: ${success} (${typeof success})\n`;
  fs.appendFileSync("debug_logs.txt", logMessage);
  
  try {
    if (success === "true" || success === true) {
      const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { payment: true }, { new: true });
      fs.appendFileSync("debug_logs.txt", `[${new Date().toISOString()}] Update Result: ${updatedOrder ? "Found & Updated" : "Order Not Found"}\n`);
      
      const order = await orderModel.findById(orderId);
      if (order) {
        await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      }
      res.json({ success: true, message: "Paid" });
    } else {
      fs.appendFileSync("debug_logs.txt", `[${new Date().toISOString()}] Verification signal was FALSE\n`);
      res.json({ success: false, message: "Verification failed signal" });
    }
  } catch (error) {
    fs.appendFileSync("debug_logs.txt", `[${new Date().toISOString()}] ERROR: ${error.message}\n`);
    res.json({ success: false, message: "Error verifying payment" });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId, payment: true });
    // Detailed log to verify status in terminal
    console.log(`[USER FETCH] Found ${orders.length} orders for ${req.body.userId}. Statuses:`, orders.map(o => o.status));
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Fetch User Orders Error:", error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing all orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ payment: true });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Fetch All Orders Error:", error);
    res.json({ success: false, message: "Error" });
  }
};

// Updating order status
const updateStatus = async (req, res) => {
  const { orderId, status } = req.body;
  console.log(`[ADMIN STATUS CHANGE] Attempting to update ${orderId} to: ${status}`);
  
  try {
    const updated = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (updated) {
      console.log(`[ADMIN STATUS CHANGE] Success! New status: ${updated.status}`);
      res.json({ success: true, message: "Status Updated" });
    } else {
      console.log(`[ADMIN STATUS CHANGE] Failed: Order ${orderId} not found`);
      res.json({ success: false, message: "Order not found" });
    }
  } catch (error) {
    console.error("[ADMIN STATUS CHANGE] ERROR:", error.message);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
