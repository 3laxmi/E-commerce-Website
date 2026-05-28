import React, { useEffect, useState, useContext, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const AIChat = () => {
  const { token, backendUrl, userId } = useContext(ShopContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiMode, setAiMode] = useState(true); // Toggle between AI and Admin chat
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket for admin chat
  useEffect(() => {
    if (!token || !userId || !aiMode) return;

    if (!socketRef.current || !socketRef.current.connected) {
      socketRef.current = io(backendUrl || "http://localhost:4000");

      socketRef.current.on("connect", () => {
        console.log("Connected to chat server");
        socketRef.current.emit("join", userId);
      });

      socketRef.current.on("receiveMessage", (msg) => {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          if (exists) return prev;
          return [...prev, msg];
        });
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from chat server");
      });
    }

    return () => {
      if (socketRef.current && !aiMode) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token, userId, backendUrl, aiMode]);

  // Load messages when chat opens
  useEffect(() => {
    if (!isOpen || !userId) return;

    const loadMessages = async () => {
      try {
        setIsLoading(true);
        if (aiMode) {
          // AI chat - no need to load, start fresh
          setMessages([
            {
              _id: "welcome",
              message: "Hi! 👋 I'm your AI shopping assistant. How can I help you today?",
              sender: "admin",
              createdAt: new Date(),
            },
          ]);
        } else {
          // Admin chat - load from backend
          const response = await axios.get(`${backendUrl}/api/messages/${userId}`);
          setMessages(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [isOpen, userId, backendUrl, aiMode]);

  // Send message to AI
  const sendAIMessage = async () => {
    if (!message.trim()) return;

    const userMsg = message;
    setMessage("");

    // Add user message to chat
    const userMessage = {
      _id: Date.now().toString(),
      message: userMsg,
      sender: "user",
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      setIsLoading(true);
      const response = await axios.post(`${backendUrl}/api/ai/chat`, {
        message: userMsg,
        productContext: "e-commerce fashion store",
      });

      if (response.data.success) {
        const aiMessage = {
          _id: Date.now().toString() + "ai",
          message: response.data.message,
          sender: "admin",
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.log(error);
      const errorMsg = {
        _id: Date.now().toString() + "error",
        message: "Sorry, I couldn't process that. Please try again.",
        sender: "admin",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message to Admin
  const sendAdminMessage = () => {
    if (!message.trim() || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      room: userId,
      message: message,
      sender: "user",
    });

    setMessage("");
  };

  const handleSendMessage = () => {
    if (aiMode) {
      sendAIMessage();
    } else {
      sendAdminMessage();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!token) {
    return (
      <>
        {/* Chat Button - Visible but disabled for non-logged-in users */}
        <button
          className="fixed bottom-6 right-6 w-14 h-14 bg-gray-400 cursor-not-allowed text-white rounded-full shadow-lg flex items-center justify-center transition-all z-40"
          title="Login to chat"
          disabled
        >
          <img src={assets.profile_icon} alt="Chat" className="w-6 h-6" />
        </button>
      </>
    );
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-40"
        title="Chat with AI or Admin"
      >
        <img src={assets.profile_icon} alt="Chat" className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-24px)] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50 h-96 sm:h-[500px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">
                {aiMode ? "🤖 AI Assistant" : "👨‍💼 Admin Support"}
              </h3>
              <p className="text-xs text-blue-100">
                {aiMode ? "Instant help available" : "Admin will respond soon"}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-800 p-1 rounded transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex border-b bg-gray-50">
            <button
              onClick={() => {
                setAiMode(true);
                setMessages([
                  {
                    _id: "welcome",
                    message: "Hi! 👋 I'm your AI shopping assistant. How can I help you today?",
                    sender: "admin",
                    createdAt: new Date(),
                  },
                ]);
              }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                aiMode
                  ? "bg-blue-100 text-blue-700 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              AI Chat
            </button>
            <button
              onClick={() => setAiMode(false)}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                !aiMode
                  ? "bg-blue-100 text-blue-700 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Admin Chat
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {isLoading && messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center">
                  {aiMode
                    ? "Start chatting with AI"
                    : "Start a conversation with admin"}
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div
                    key={msg._id || i}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-300 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm break-words">{msg.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  aiMode
                    ? "Ask about products, shipping..."
                    : "Type your message..."
                }
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;
