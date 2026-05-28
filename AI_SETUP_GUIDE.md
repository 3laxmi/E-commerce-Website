# AI Features Setup Guide

## Overview
This guide walks you through setting up AI Chatbot and Product Recommendations using Google Gemini API.

## Features Added
1. **AI Chatbot** - 24/7 customer support with natural language understanding
2. **Product Recommendations** - Personalized recommendations based on browsing history
3. **User Interaction Tracking** - Tracks product views and search queries

---

## Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

---

## Step 2: Update Backend Environment

1. Open `backend/.env`
2. Add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

---

## Step 3: Install Dependencies

### Backend
```bash
cd backend
npm install @google/generative-ai
npm install
```

### Frontend
```bash
cd frontend
npm install
```

---

## Step 4: Start the Application

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm start
```

---

## Features Usage

### 1. AI Chatbot
- Click the chat button (bottom-right corner)
- Toggle between "AI Chat" and "Admin Chat"
- Ask questions about products, shipping, returns, sizing, etc.
- AI responds instantly with helpful information

### 2. Product Recommendations
- Browse products to build your history
- View product page to see personalized recommendations
- Recommendations appear at the bottom of product pages
- Based on your browsing history and cart items

### 3. User Tracking
- Product views are automatically tracked
- Search queries are recorded
- Data is used to improve recommendations

---

## API Endpoints

### AI Chatbot
```
POST /api/ai/chat
Body: { message: string, productContext?: string }
Response: { success: boolean, message: string }
```

### Get Recommendations
```
POST /api/ai/recommendations
Body: { userId: string }
Response: { success: boolean, recommendations: Product[] }
```

### Track Product View
```
POST /api/ai/track-view
Body: { userId: string, productId: string }
Response: { success: boolean, message: string }
```

### Track Search Query
```
POST /api/ai/track-search
Body: { userId: string, query: string }
Response: { success: boolean, message: string }
```

---

## File Structure

### Backend
```
backend/
├── services/
│   └── aiService.js          # AI service with Gemini integration
├── controllers/
│   └── aiController.js       # AI endpoints logic
├── routes/
│   └── aiRoute.js            # AI routes
├── models/
│   └── userInteractionModel.js # User interaction tracking
└── Server.js                 # Updated with AI routes
```

### Frontend
```
frontend/src/
├── components/
│   ├── AIChat.jsx            # AI Chat component
│   └── AIRecommendations.jsx # Recommendations component
└── pages/
    └── Product.jsx           # Updated with tracking
```

---

## Troubleshooting

### Issue: "Failed to get AI response"
- Check if GEMINI_API_KEY is set correctly in .env
- Verify API key is active on Google AI Studio
- Check internet connection

### Issue: Recommendations not showing
- Make sure you're logged in
- Browse at least 2-3 products first
- Wait a few seconds for recommendations to load

### Issue: Chat not working
- Ensure backend is running on correct port
- Check if token is valid
- Verify CORS settings in Server.js

---

## Customization

### Change AI Model
Edit `backend/services/aiService.js`:
```javascript
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
```

### Adjust Recommendation Count
Edit `backend/controllers/aiController.js`:
```javascript
recommendations: recommendedProducts.slice(0, 5) // Change 5 to desired count
```

### Customize AI Behavior
Edit the system prompt in `backend/services/aiService.js`:
```javascript
const systemPrompt = `Your custom instructions here...`;
```

---

## Security Notes

- Never commit `.env` file with API keys
- Use environment variables for sensitive data
- Validate all user inputs on backend
- Rate limit AI endpoints to prevent abuse

---

## Performance Tips

1. Cache recommendations for 1 hour
2. Limit AI requests to 1 per second per user
3. Use pagination for product lists
4. Optimize database queries with indexes

---

## Next Steps

1. Test AI chatbot with various questions
2. Browse products to generate recommendations
3. Monitor API usage on Google AI Studio
4. Customize prompts based on your needs
5. Add more AI features (image recognition, sentiment analysis, etc.)

---

## Support

For issues or questions:
1. Check Google Generative AI documentation
2. Review error logs in browser console
3. Check backend server logs
4. Verify all dependencies are installed

