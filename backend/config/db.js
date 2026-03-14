import mongoose from "mongoose";

export const connectDb = async()=>{
await mongoose.connect("mongodb+srv://arcoders:12345678ar@cluster0.3ylachw.mongodb.net/foodDelivery")
.then(() => {})
}
