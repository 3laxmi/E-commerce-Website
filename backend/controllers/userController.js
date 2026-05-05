import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}



//route for user login

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User does't exists" })
        }

        if (!user.isActive) {
            return res.json({ success: false, message: "User account is inactive. Please contact support." })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id)
            res.json({ success: true, token, role: user.role })
        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

// route for user ragistration

const registerUser = async (req, res) => {

    try {

        const { name, email, password, phoneno } = req.body;

        // checking user already exists or not
        const exists = await userModel.findOne({ email })

        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        // validating email format and strong password
        if (!validator.isEmail(email)) {

            return res.json({ success: false, message: " Please enter a valid email" })

        }

        if (password.length < 8) {

            return res.json({ success: false, message: " Please enter a strong password" })

        }

        // hashing user password

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            phoneno
        })

        const user = await newUser.save()

        res.json({ success: true, message: 'Registration successful' })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }

    // res.json({msg:\"Register API Working\"})

}

//route for admin login

const adminLogin = async (req, res) => {
    try{
        const {email, password} = req.body 
        const user = await userModel.findOne({ email });
        
        if (!user || user.role !== 'admin') {
            return res.json({success:false, message:"Invalid credentials"})
        }

        if (!user.isActive) {
            return res.json({success:false, message:"Admin account is inactive"})
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = createToken(user._id);
            res.json({success:true, token, role: 'admin'})
        } else{
            res.json({success:false, message:"Invalid credentials"})
        }

    } catch(error){
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

//  to get the user info. in myprofile component

  const getUserprofile = async (req, res)=>{
    try{
        // If userId is provided in body, get that user's profile (for admin)
        // Otherwise, get the current user's profile from token
        let userId = req.body.userId;
        
        if (!userId) {
            // Get userId from token (for current user)
            const token = req.headers.token || req.headers.authorization?.split(" ")[1];
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            }
        }

        if (!userId) {
            return res.json({success:false, message:"User ID not found"})
        }

        const user = await userModel.findById(userId)
        
        if (!user) {
            return res.json({success:false, message:"User not found"})
        }

        res.json({success:true, user:{
            name:user.name,
            email:user.email,
            phoneno:user.phoneno
        }})

    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})

    }
  }

  const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password -resetToken -resetTokenExpiry')
        
        // Ensure all users have isActive field (for backward compatibility)
        const usersWithStatus = users.map(user => ({
            ...user.toObject(),
            isActive: user.isActive !== undefined ? user.isActive : true
        }))
        
        res.json({ success: true, users: usersWithStatus })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
  }

  const forgetPassword = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.json({ success: false, message: 'Email not found' })
        }

        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetTokenExpiry = Date.now() + 3600000

        await userModel.findByIdAndUpdate(user._id, { resetToken, resetTokenExpiry })

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Password Reset Request',
            html: `<p>Click the link below to reset your password. Link expires in 1 hour.</p>\n                   <a href="${resetLink}">${resetLink}</a>`
        })

        res.json({ success: true, message: 'Reset link sent to your email' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
  }

  const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body

        const user = await userModel.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        })

        if (!user) {
            return res.json({ success: false, message: 'Invalid or expired reset link' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        await userModel.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        })

        res.json({ success: true, message: 'Password reset successfully' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
  }

  const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const adminSecret = req.headers['x-admin-secret']

        if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
            return res.json({ success: false, message: 'Unauthorized' })
        }

        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: 'Admin already exists' })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newAdmin = new userModel({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        })

        await newAdmin.save()
        res.json({ success: true, message: 'Admin created successfully' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
  }

  const verifyToken = async (req, res) => {
    try {
        const token = req.headers.token || req.headers.authorization?.split(" ")[1]
        
        if (!token) {
            return res.json({ success: false, message: 'No token provided' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id)

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (!user.isActive) {
            return res.json({ success: false, message: 'User account is inactive' })
        }

        res.json({ 
            success: true, 
            role: user.role,
            userId: user._id,
            email: user.email
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Invalid token' })
    }
  }

  const updateProfile = async (req, res) => {
    try {
        const token = req.headers.token || req.headers.authorization?.split(" ")[1]
        
        if (!token) {
            return res.json({ success: false, message: 'No token provided' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id
        const { name, email, phoneno } = req.body

        if (!userId) {
            return res.json({ success: false, message: 'User ID not found' })
        }

        if (!name || name.trim() === '') {
            return res.json({ success: false, message: 'Name is required' })
        }

        // Validate email if it's being changed
        if (email && !validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email' })
        }

        // Check if email is already taken by another user
        if (email) {
            const existingUser = await userModel.findOne({ email, _id: { $ne: userId } })
            if (existingUser) {
                return res.json({ success: false, message: 'Email already in use' })
            }
        }

        const updateData = { name, phoneno }
        if (email) {
            updateData.email = email
        }

        const user = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        )

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            user: {
                name: user.name,
                email: user.email,
                phoneno: user.phoneno
            }
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
  }

  const toggleUserStatus = async (req, res) => {
    try {
        console.log('=== Toggle User Status Called ===')
        console.log('Request body:', req.body)
        
        const { userId } = req.body
        
        console.log('Extracted userId:', userId)
        
        if (!userId) {
            console.log('ERROR: No userId provided')
            return res.json({ success: false, message: 'User ID is required' })
        }

        const user = await userModel.findById(userId)
        
        if (!user) {
            console.log('ERROR: User not found with ID:', userId)
            return res.json({ success: false, message: 'User not found' })
        }

        console.log('User found:', user.name, 'Current isActive:', user.isActive)
        
        user.isActive = !user.isActive
        await user.save()

        console.log('User updated. New isActive:', user.isActive)

        res.json({ 
            success: true, 
            message: `User account ${user.isActive ? 'activated' : 'deactivated'} successfully`,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isActive: user.isActive
            }
        })

    } catch (error) {
        console.log('ERROR in toggleUserStatus:', error)
        res.json({ success: false, message: error.message })
    }
  }

export { loginUser, registerUser, adminLogin, createAdmin, getUserprofile, getAllUsers, forgetPassword, resetPassword, verifyToken, updateProfile, toggleUserStatus }
