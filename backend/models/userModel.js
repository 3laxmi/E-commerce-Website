import mongoose, { Mongoose } from "mongoose";


const userSchema = new mongoose.Schema({
    name:{type: String, required:true},
    email:{type : String, required:true, unique : true},
    password:{type:String, required:true},
    role:{type:String, enum:['user','admin'], default:'user'},
    cartData : {type:Object, default:{}},
    resetToken:{type:String, default:null},
    resetTokenExpiry:{type:Number, default:null},
    wishlistData :{type:[mongoose.Schema.Types.ObjectId], default : []},
    phoneno : {type:String, default:null},
    isActive : {type:Boolean, default:true}

}, {minimize:false})


const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel
