// Mock responses for when API is not available
const mockResponses = {
  "return": "Our return policy allows returns within 7 days of purchase. Items must be in original condition with tags attached. Please contact our support team for return authorization.",
  "shipping": "We offer free shipping on orders over ₹500. Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available for ₹99.",
  "size": "We offer sizes XS, S, M, L, XL, and XXL. Please refer to our size chart on each product page. If you're unsure, contact our support team.",
  "payment": "We accept all major credit cards, debit cards, UPI, and cash on delivery. All payments are secure and encrypted.",
  "track": "You can track your order using the tracking number sent to your email. Orders typically arrive within 5-7 business days.",
  "discount": "We offer seasonal discounts and promotions. Subscribe to our newsletter to get exclusive deals and early access to sales.",
  "contact": "You can reach our support team via email at support@ecommerce.com or use the chat feature. We respond within 24 hours.",
  "default": "Thank you for your question! I'm here to help with information about our products, shipping, returns, and more. How can I assist you today?"
};

// Function to find best matching mock response
const getMockResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  if (message.includes("return") || message.includes("refund")) return mockResponses.return;
  if (message.includes("ship") || message.includes("delivery")) return mockResponses.shipping;
  if (message.includes("size") || message.includes("fit")) return mockResponses.size;
  if (message.includes("payment") || message.includes("pay")) return mockResponses.payment;
  if (message.includes("track") || message.includes("order")) return mockResponses.track;
  if (message.includes("discount") || message.includes("sale") || message.includes("offer")) return mockResponses.discount;
  if (message.includes("contact") || message.includes("support") || message.includes("help")) return mockResponses.contact;
  
  return mockResponses.default;
};

// Call Gemini API directly via HTTP
const callGeminiAPI = async (prompt) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not set");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error("No response from API");
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw error;
  }
};

// AI Chatbot - Answer customer queries
export const getAIChatResponse = async (userMessage, context = "") => {
  try {
    const systemPrompt = `You are a helpful e-commerce customer support assistant for a fashion store. 
    Answer questions about products, shipping, returns, sizing, and general shopping queries.
    Be concise, friendly, and professional. Keep responses under 150 words.
    ${context ? `Context: ${context}` : ""}`;

    const fullPrompt = systemPrompt + "\n\nCustomer: " + userMessage + "\n\nAssistant:";

    console.log(`✅ Using real Gemini API (gemini-flash-latest) for: ${userMessage}`);
    const text = await callGeminiAPI(fullPrompt);
    
    if (!text || text.trim().length === 0) {
      return getMockResponse(userMessage);
    }
    
    return text;
  } catch (error) {
    console.error("AI Chat Error:", error.message);
    console.log("Falling back to mock response");
    return getMockResponse(userMessage);
  }
};

// Generate Product Recommendations based on user preferences
export const getProductRecommendations = async (
  userHistory,
  cartItems,
  allProducts
) => {
  try {
    if (allProducts.length === 0) {
      return [];
    }

    const productContext = allProducts
      .slice(0, 20)
      .map((p) => `${p.name} (${p.category}/${p.subCategory}) - ₹${p.price}`)
      .join(", ");

    const prompt = `Based on the following:
    - User browsing history: ${userHistory.join(", ") || "None"}
    - Current cart items: ${cartItems.join(", ") || "None"}
    - Available products: ${productContext}
    
    Recommend 3-5 products that would be a good fit. Return ONLY product names separated by commas, nothing else.`;

    console.log(`✅ Using real Gemini API (gemini-flash-latest) for recommendations`);
    const text = await callGeminiAPI(prompt);
    const recommendations = text
      .split(",")
      .map((r) => r.trim())
      .filter(r => r.length > 0);
    
    return recommendations.length > 0 ? recommendations : allProducts.slice(0, 5).map(p => p.name);
  } catch (error) {
    console.error("Recommendation Error:", error);
    return allProducts.slice(0, 5).map(p => p.name);
  }
};

// Generate Product Description from basic info
export const generateProductDescription = async (productName, category) => {
  try {
    const prompt = `Generate a compelling 2-3 sentence product description for a ${category} item called "${productName}". 
    Make it engaging and highlight key benefits. Keep it under 100 words.`;

    console.log(`✅ Using real Gemini API (gemini-flash-latest) for product description`);
    const text = await callGeminiAPI(prompt);
    return text;
  } catch (error) {
    console.error("Description Generation Error:", error);
    return `High-quality ${category} item. Perfect for everyday wear. Available in multiple sizes and colors.`;
  }
};

// Analyze user query to extract intent
export const analyzeUserQuery = async (query) => {
  try {
    const prompt = `Analyze this customer query and respond with ONLY one of these intents: 
    PRODUCT_SEARCH, PRODUCT_INFO, SHIPPING, RETURNS, SIZING, GENERAL_HELP, or OTHER.
    Query: "${query}"`;

    console.log(`✅ Using real Gemini API (gemini-flash-latest) for query analysis`);
    const text = await callGeminiAPI(prompt);
    return text.trim();
  } catch (error) {
    console.error("Query Analysis Error:", error);
    return "GENERAL_HELP";
  }
};

// Test function to list available models with details
export const listAvailableModels = async () => {
  try {
    console.log("✅ Using gemini-flash-latest model");
    return ["gemini-flash-latest"];
  } catch (error) {
    console.error("Error listing models:", error);
    return [];
  }
};
