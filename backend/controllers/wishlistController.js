import userModel from "../models/userModel.js"
import productModel from "../models/productModel.js"

const addToWishlist = async (req, res) => {
    try {
        const { userId, itemId } = req.body
        const user = await userModel.findById(userId)
        let wishlistData = user.wishlistData || []

        const itemIdStr = itemId.toString()
        const exists = wishlistData.some(id => id.toString() === itemIdStr)
        
        if (exists) {
            return res.json({ success: true, message: "Already in Wishlist" })
        }

        wishlistData.push(itemId)
        await userModel.findByIdAndUpdate(userId, { wishlistData })
        res.json({ success: true, message: "Added to Wishlist" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const removeToWishlist = async (req, res) => {
    try {
        const { userId, itemId } = req.body
        const user = await userModel.findById(userId)
        let wishlistData = user.wishlistData || []

        // Convert to strings for comparison to avoid ObjectId issues
        const itemIdStr = itemId.toString()
        wishlistData = wishlistData.filter(id => id.toString() !== itemIdStr)

        await userModel.findByIdAndUpdate(userId, { wishlistData })
        res.json({ success: true, message: "Removed from wishlist" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const getUserWishlist = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await userModel.findById(userId)
        let wishlistData = user.wishlistData || []
        
        const uniqueIds = new Set()
        const uniqueWishlist = []
        
        for (let id of wishlistData) {
            const idStr = id.toString()
            if (!uniqueIds.has(idStr)) {
                uniqueIds.add(idStr)
                uniqueWishlist.push(id)
            }
        }
        
        const validWishlist = []
        
        for (let id of uniqueWishlist) {
            const product = await productModel.findById(id)
            if (product) {
                validWishlist.push(id)
            }
        }
        
        if (validWishlist.length !== wishlistData.length) {
            await userModel.findByIdAndUpdate(userId, { wishlistData: validWishlist })
        }
        
        res.json({ success: true, wishlistData: validWishlist })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export { addToWishlist, removeToWishlist, getUserWishlist }
