import express from "express";
import {
  aiChat,
  getRecommendations,
  trackProductView,
  trackSearchQuery,
} from "../controllers/aiController.js";
import { listAvailableModels } from "../services/aiService.js";

const aiRouter = express.Router();

// Test endpoint to check available models
aiRouter.get("/test-models", async (req, res) => {
  try {
    const models = await listAvailableModels();
    res.json({
      success: true,
      message: "Check backend console for available models",
      modelsCount: models.length,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

// AI Chatbot endpoint
aiRouter.post("/chat", aiChat);

// Get personalized recommendations
aiRouter.post("/recommendations", getRecommendations);

// Track product views
aiRouter.post("/track-view", trackProductView);

// Track search queries
aiRouter.post("/track-search", trackSearchQuery);

export default aiRouter;
