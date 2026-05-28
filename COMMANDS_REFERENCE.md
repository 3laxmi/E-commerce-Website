# 🚀 Step-by-Step Commands - AI Features Setup

## 📋 Prerequisites
- Node.js installed
- npm installed
- Git installed (optional)

---

## 🔑 Step 1: Get Gemini API Key

### Option A: Web Browser
```
1. Open: https://aistudio.google.com/app/apikey
2. Click: "Create API Key"
3. Select: "Create API key in new project"
4. Copy: Your API key
5. Save: Keep it safe
```

### Option B: Command Line (if you have gcloud CLI)
```bash
gcloud auth application-default create
```

---

## 📝 Step 2: Update Environment Variables

### Open backend/.env
```bash
# Navigate to backend folder
cd backend

# Open .env file with your editor
# Add this line:
GEMINI_API_KEY=your_api_key_here

# Save the file
```

### Verify .env file
```bash
# Check if GEMINI_API_KEY is added
cat .env | grep GEMINI_API_KEY
```

---

## 📦 Step 3: Install Dependencies

### Backend Setup
```bash
# Navigate to backend
cd backend

# Install Gemini package
npm install @google/generative-ai

# Install all dependencies
npm install

# Verify installation
npm list @google/generative-ai
```

### Frontend Setup
```bash
# Navigate to frontend
cd ../frontend

# Install dependencies (should already have axios)
npm install

# Verify axios is installed
npm list axios
```

---

## ▶️ Step 4: Start the Application

### Terminal 1 - Start Backend
```bash
# Navigate to backend
cd backend

# Start development server
npm run dev

# Expected output:
# Server started on PORT: 4000
```

### Terminal 2 - Start Frontend
```bash
# Navigate to frontend
cd frontend

# Start development server
npm start

# Expected output:
# VITE v7.0.0  ready in XXX ms
# ➜  Local:   http://localhost:5174/
```

---

## ✅ Step 5: Verify Installation

### Check Backend
```bash
# In Terminal 1 (backend)
# You should see:
# - "Server started on PORT: 4000"
# - "Connected to MongoDB"
# - No error messages
```

### Check Frontend
```bash
# In Terminal 2 (frontend)
# You should see:
# - "VITE ready"
# - "Local: http://localhost:5174/"
# - No error messages
```

### Test API Connection
```bash
# In a new terminal
curl http://localhost:4000/

# Expected response:
# API Working
```

---

## 🧪 Step 6: Test Features

### Test AI Chatbot
```bash
# 1. Open browser: http://localhost:5174
# 2. Login to your account
# 3. Click chat button (bottom-right corner)
# 4. Click "AI Chat" tab
# 5. Type: "What's your return policy?"
# 6. Should get instant AI response
```

### Test Recommendations
```bash
# 1. Browse 3-4 different products
# 2. Go to any product page
# 3. Scroll down to "RECOMMENDED FOR YOU"
# 4. Should see 3-5 personalized products
```

### Test Tracking
```bash
# 1. Open browser DevTools (F12)
# 2. Go to Network tab
# 3. Browse a product
# 4. Should see POST to /api/ai/track-view
# 5. Status should be 200
```

---

## 🔍 Step 7: Verify Everything Works

### Backend Logs
```bash
# Terminal 1 should show:
# - "Server started on PORT: 4000"
# - "Connected to MongoDB"
# - "user connected" (when frontend connects)
# - "Message sent to room" (when chat works)
```

### Frontend Console
```bash
# Open DevTools (F12)
# Console tab should show:
# - No red errors
# - "Connected to chat server" (if using admin chat)
# - API responses for recommendations
```

### Database
```bash
# Check MongoDB for new collection
# Should have: userinteractions collection
# With documents containing viewedProducts and searchQueries
```

---

## 🐛 Troubleshooting Commands

### If Backend Won't Start
```bash
# Check if port 4000 is in use
lsof -i :4000  # macOS/Linux
netstat -ano | findstr :4000  # Windows

# Kill process using port 4000
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Try starting again
npm run dev
```

### If Frontend Won't Start
```bash
# Check if port 5174 is in use
lsof -i :5174  # macOS/Linux
netstat -ano | findstr :5174  # Windows

# Clear cache and reinstall
rm -rf node_modules
npm install
npm start
```

### If Dependencies Error
```bash
# Clear npm cache
npm cache clean --force

# Reinstall all dependencies
rm -rf node_modules
npm install

# Install Gemini package specifically
npm install @google/generative-ai

# Verify installation
npm list
```

### If API Key Error
```bash
# Verify .env file exists
cat backend/.env

# Check if GEMINI_API_KEY is set
echo $GEMINI_API_KEY  # macOS/Linux
echo %GEMINI_API_KEY%  # Windows

# Restart backend after updating .env
# Press Ctrl+C to stop
# Run: npm run dev
```

---

## 📊 Monitoring Commands

### Check Backend Logs
```bash
# Terminal 1 (backend)
# Watch for:
# - "Server started on PORT: 4000"
# - "Connected to MongoDB"
# - "user connected"
# - "Message sent to room"
```

### Check Frontend Logs
```bash
# Open DevTools (F12)
# Console tab
# Watch for:
# - No red errors
# - API responses
# - Socket connections
```

### Check Database
```bash
# MongoDB connection
# Database: test (or your database name)
# Collections:
# - users
# - products
# - orders
# - userinteractions (NEW)
```

---

## 🔄 Restart Commands

### Restart Backend
```bash
# Terminal 1
# Press: Ctrl+C
# Run: npm run dev
```

### Restart Frontend
```bash
# Terminal 2
# Press: Ctrl+C
# Run: npm start
```

### Restart Everything
```bash
# Terminal 1
Ctrl+C
npm run dev

# Terminal 2
Ctrl+C
npm start

# Terminal 3 (optional - for testing)
# Run test commands
```

---

## 🧹 Cleanup Commands

### Clear Node Modules
```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd ../frontend
rm -rf node_modules
npm install
```

### Clear Cache
```bash
# npm cache
npm cache clean --force

# Browser cache
# Open DevTools (F12)
# Right-click refresh button
# Select "Empty cache and hard refresh"
```

### Reset Database (if needed)
```bash
# MongoDB
# Connect to MongoDB
# Drop userinteractions collection
db.userinteractions.drop()

# Or drop entire database
db.dropDatabase()
```

---

## 📱 Testing Commands

### Test API Endpoints
```bash
# Test AI Chat
curl -X POST http://localhost:4000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "token: your_token_here" \
  -d '{"message":"What sizes do you have?"}'

# Test Recommendations
curl -X POST http://localhost:4000/api/ai/recommendations \
  -H "Content-Type: application/json" \
  -H "token: your_token_here" \
  -d '{"userId":"user_id_here"}'

# Test Track View
curl -X POST http://localhost:4000/api/ai/track-view \
  -H "Content-Type: application/json" \
  -H "token: your_token_here" \
  -d '{"userId":"user_id_here","productId":"product_id_here"}'
```

### Test with Postman
```
1. Open Postman
2. Create new request
3. Method: POST
4. URL: http://localhost:4000/api/ai/chat
5. Headers:
   - Content-Type: application/json
   - token: your_token_here
6. Body (raw JSON):
   {
     "message": "What sizes do you have?"
   }
7. Click Send
8. Should get AI response
```

---

## 📋 Quick Reference

### Ports
```
Backend: 4000
Frontend: 5174
MongoDB: 27017 (default)
```

### Key Files
```
backend/.env - Environment variables
backend/Server.js - Main server file
backend/services/aiService.js - AI logic
frontend/src/components/AIChat.jsx - Chat UI
frontend/src/pages/Product.jsx - Product page
```

### Key Commands
```
npm run dev - Start backend
npm start - Start frontend
npm install - Install dependencies
npm list - List installed packages
npm cache clean --force - Clear cache
```

---

## ✅ Final Checklist

- [ ] Gemini API key obtained
- [ ] .env file updated
- [ ] Dependencies installed
- [ ] Backend running (port 4000)
- [ ] Frontend running (port 5174)
- [ ] Can login to account
- [ ] Chat button visible
- [ ] AI Chat responds
- [ ] Recommendations show
- [ ] No errors in console

---

## 🎉 You're Ready!

All commands executed successfully? Great! Your AI features are ready to use.

**Next Steps:**
1. Test AI chatbot
2. Test recommendations
3. Browse products
4. Monitor performance
5. Gather user feedback

---

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review error messages carefully
3. Check backend logs
4. Check browser console
5. Verify all dependencies installed
6. Ensure API key is correct

---

**Happy coding! 🚀**

