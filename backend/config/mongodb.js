import mongoose from "mongoose";

const connectDB = async () =>{

    mongoose.connection.on('connected', () => {
         console.log("DB connected")
    })

    try {
        await mongoose.connect(process.env.MONGODB_URI)
    } catch (error) {
        console.log("MongoDB connection error:", error.message)
        process.exit(1)
    }
}

export default connectDB;