import express from "express"
import authMidddleware from "../middleware/auth.js";
import { addToCart,removeFromCart,getCart } from "../controller/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/add", authMidddleware, addToCart);
cartRouter.post("/remove",  authMidddleware, removeFromCart);
cartRouter.post("/get", authMidddleware,  getCart);


export default cartRouter;
