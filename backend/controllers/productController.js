import {v2 as cloudinary} from "cloudinary";
import productModel from "../models/productModel.js";

// function for add product


const addProduct = async (req, res) => {
    try{

        const {name, description, price, category, subCategory, sizes, bestseller} = req.body
          
        const image1 = req.files.image1 && req.files.image1[0]
         const image2 = req.files.image2 && req.files.image2[0]
          const image3 =  req.files.image3 && req.files.image3[0]
           const image4 =   req.files.image4 && req.files.image4[0]

           const images = [image1,image2,image3, image4].filter ((item)=> item !== undefined)

           let  imagesUrl = await Promise.all(
            images.map(async (item) => {
                let  result = await cloudinary.uploader.upload(item.path, {resource_type:'image'});
                return result.secure_url

            })
           )
                 
           const productData = {
            name,
            description,
            category,
            price : Number(price),
            subCategory,
            bestseller : bestseller === "true"? true : false,
            sizes:JSON.parse(sizes),
            image:imagesUrl,
            date: Date.now()

           }
        //    console.log(productData);

           const product = new productModel(productData);
           await product.save()

           res.json({
  success: true,
  message: "Product added successfully",
  product: product.toObject()
});


        //    res.json({success:true, message:"Product added successfully"})

    } catch (error){
        console.log(error)
        res.json({success:false, message:error.message})

    }

}

// function for update product
const updateProduct = async (req, res) => {
    try{

        const {id, name, description, price, category, subCategory, sizes, bestseller} = req.body
        
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = []
        
        // Upload new images if provided
        if (images.length > 0) {
            imagesUrl = await Promise.all(
                images.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, {resource_type:'image'});
                    return result.secure_url
                })
            )
        }

        // Get existing product
        const product = await productModel.findById(id)
        
        if (!product) {
            return res.json({success:false, message:"Product not found"})
        }

        // Update product data
        const updateData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes)
        }

        // If new images provided, replace all images. Otherwise keep existing images
        if (imagesUrl.length > 0) {
            updateData.image = imagesUrl
        }

        const updatedProduct = await productModel.findByIdAndUpdate(id, updateData, {new: true})

        res.json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct.toObject()
        })

    } catch (error){
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

// function for list product
const listProducts = async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        
        // Calculate skip: if page=1, skip=0; if page=2, skip=12
        const skip = (page - 1) * limit;
        
        // Get total count of products
        const totalProducts = await productModel.countDocuments();
        
        // Get products for this page
        const products = await productModel.find({}).skip(skip).limit(limit);
        
        // Calculate total pages
        const totalPages = Math.ceil(totalProducts / limit);
        
        res.json({
            success: true,
            products,
            totalProducts,
            totalPages,
            currentPage: page,
            limit
        });

    } catch (error){
         console.log(error)
        res.json({success:false, message:error.message})
    }
}

// function for  remove product
const removeProduct = async (req, res) => {

    try{
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true, message:"Product Removed"})

    } catch (error){
         console.log(error)
        res.json({success:false, message:error.message})
    }
}

// function for single product info
const singleProduct = async (req, res) => {

    try{

        const {productId} = req.body
        const product = await productModel.findById(productId)
         res.json({success:true, product})

    }catch (error) {
        console.log(error)
         res.json({success:false, message:error.message})

    }

}


export { listProducts, addProduct, removeProduct, singleProduct, updateProduct }
