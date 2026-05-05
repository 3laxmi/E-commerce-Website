import mongoose, { Mongoose } from "mongoose";


const messageSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    enum: ["user", "admin"],
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const messageModel = mongoose.models.message || mongoose.model('message', messageSchema)


export default messageModel;