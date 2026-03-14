import "dotenv/config"
import express from "express"

import cors from "cors"
import { connectDb } from "./config/db.js";
import foodRouter from "./routes/foodRoutes.js";
import userRouter from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
// app config

const app = express();
const Port = 4000;

//middleware

app.use(express.json())

app.use(cors())

// db connection

connectDb();

//api endpoints

app.use("/api/food" ,foodRouter)
app.use("/images",express.static("uploads"))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)


app.get("/",(req,res)=>{
res.send("Api is working....")
})

app.listen(Port,()=>{
})
// mongodb+srv://arcoders:22027977@cluster0.3ylachw.mongodb.net/?

//22027977 password of mongocloud altas pass and arcoder is username 