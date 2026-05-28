import {
  getAIChatResponse,
  getProductRecommendations,
  analyzeUserQuery,
} from "../services/aiService.js";
import productModel from "../models/productModel.js";
import userInteractionModel from "../models/userInteractionModel.js";

// AI Chatbot endpoint
export const aiChat = async (req, res) => {
  try {
    const { message, productContext } = req.body;

    if (!message) {
      return res.json({ success: false, message: "Message is required" });
    }

    const response = await getAIChatResponse(message, productContext);

    res.json({
      success: true,
      message: response,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get personalized product recommendations
export const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.body;

    // Get user interaction history
    let userHistory = [];
    let cartItems = [];

    if (userId) {
      const interaction = await userInteractionModel.findOne({ userId });
      if (interaction) {
        userHistory = interaction.viewedProducts
          .slice(-5)
          .map((item) => item.productId);
      }
    }

    // Get all products
    const allProducts = await productModel.find({}).limit(50);

    if (allProducts.length === 0) {
      return res.json({
        success: true,
        recommendations: [],
        message: "No products available",
      });
    }

    // Get AI recommendations
    const recommendations = await getProductRecommendations(
      userHistory,
      cartItems,
      allProducts
    );

    // Match recommendations with actual products
    const recommendedProducts = allProducts.filter((product) =>
      recommendations.some(
        (rec) =>
          product.name.toLowerCase().includes(rec.toLowerCase()) ||
          rec.toLowerCase().includes(product.name.toLowerCase())
      )
    );

    res.json({
      success: true,
      recommendations: recommendedProducts.slice(0, 5),
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Track user product view
export const trackProductView = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.json({
        success: false,
        message: "userId and productId are required",
      });
    }

    let interaction = await userInteractionModel.findOne({ userId });

    if (!interaction) {
      interaction = new userInteractionModel({
        userId,
        viewedProducts: [{ productId }],
      });
    } else {
      // Add to viewed products (avoid duplicates in recent views)
      const exists = interaction.viewedProducts.some(
        (item) => item.productId.toString() === productId
      );

      if (!exists) {
        interaction.viewedProducts.push({ productId });
      }

      // Keep only last 20 views
      if (interaction.viewedProducts.length > 20) {
        interaction.viewedProducts = interaction.viewedProducts.slice(-20);
      }
    }

    interaction.lastUpdated = new Date();
    await interaction.save();

    res.json({ success: true, message: "View tracked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Track search queries
export const trackSearchQuery = async (req, res) => {
  try {
    const { userId, query } = req.body;

    if (!userId || !query) {
      return res.json({
        success: false,
        message: "userId and query are required",
      });
    }

    let interaction = await userInteractionModel.findOne({ userId });

    if (!interaction) {
      interaction = new userInteractionModel({
        userId,
        searchQueries: [{ query }],
      });
    } else {
      interaction.searchQueries.push({ query });

      // Keep only last 50 searches
      if (interaction.searchQueries.length > 50) {
        interaction.searchQueries = interaction.searchQueries.slice(-50);
      }
    }

    interaction.lastUpdated = new Date();
    await interaction.save();

    res.json({ success: true, message: "Search tracked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
