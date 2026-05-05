import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import wishlistRouter from './routes/wishlistRoute.js'
import subscriberRouter from './routes/subscriberRoute.js'
import messageModel from './models/messageModel.js'
import userModel from './models/userModel.js'
import mongoose from 'mongoose'


// app config
const app = express()
const port = process.env.PORT || 4000;

connectDB()
connectCloudinary()

// Cleanup function to convert wishlist strings to ObjectIds
const cleanupWishlistData = async () => {
  try {
    console.log('Starting wishlist data cleanup...')
    const users = await userModel.find({})
    
    for (let user of users) {
      if (user.wishlistData && user.wishlistData.length > 0) {
        const cleanedWishlist = user.wishlistData.map(id => {
          // If it's already an ObjectId, keep it
          if (mongoose.Types.ObjectId.isValid(id) && typeof id === 'object') {
            return id
          }
          // If it's a string, convert to ObjectId
          if (typeof id === 'string' && mongoose.Types.ObjectId.isValid(id)) {
            return new mongoose.Types.ObjectId(id)
          }
          return id
        })
        
        // Remove duplicates
        const uniqueWishlist = [...new Set(cleanedWishlist.map(id => id.toString()))].map(str => new mongoose.Types.ObjectId(str))
        
        if (uniqueWishlist.length !== user.wishlistData.length) {
          await userModel.findByIdAndUpdate(user._id, { wishlistData: uniqueWishlist })
          console.log(`Updated user ${user._id}: ${user.wishlistData.length} -> ${uniqueWishlist.length} items`)
        }
      }
    }
    console.log('Wishlist cleanup completed!')
  } catch (error) {
    console.log('Cleanup error:', error)
  }
}

// Run cleanup on server start
setTimeout(() => {
  cleanupWishlistData()
}, 1000)

// middlewares

app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5174",
  credentials: true
}))



// api endpoints

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/wishlist', wishlistRouter)
app.use('/api/subscriber', subscriberRouter)


app.get('/', (req, res) => {
  res.send("API Working")
})

app.get("/api/messages/:room", async (req, res) => {
  try {
    const messages = await messageModel.find({ room: req.params.room }).sort({ createdAt: 1 })
    res.json(messages)
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
})


const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5174",
    credentials: true
  },
})

io.on("connection", (socket) => {
  console.log("user connected", socket.id)

  // join room
  socket.on("join", (room) => {
    socket.join(room)
    console.log("Joined room:", room)
  })

  // send message
  socket.on("sendMessage", async ({ room, message, sender }) => {
    try {
      const newMessage = new messageModel({
        room,
        sender,
        message,
      })

      await newMessage.save()

      // Emit to all users in the room (including sender)
      io.to(room).emit("receiveMessage", newMessage)
      console.log("Message sent to room:", room, "from:", sender)
    }
    catch (error) {
      console.log("Message error:", error.message)
    }
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})


server.listen(port, () => {
  console.log('Server started on PORT:', port)
})
