import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

const adminAuth = async(req, res, next) =>{
    try{
        const token = req.headers.authorization?.split(" ")[1] || req.headers.token;

        if(!token){
            return res.json({success:false, message:"Not Authorized Login Again"})
        }
        
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(token_decode.id)
        
        if(!user || user.role !== 'admin'){
            return res.json({success:false, message:"Not Authorized Login Again"})
        }
        
        // Initialize req.body if it doesn't exist
        if (!req.body) {
            req.body = {}
        }
        // Only set adminId, don't overwrite userId if it's already provided
        req.body.adminId = token_decode.id
        next()

    } catch (error){
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

export default adminAuth
