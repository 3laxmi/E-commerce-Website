import React, { useEffect, useState, useContext, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const Chat = () => {
  const { token, backendUrl, userId } = useContext(ShopContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // helper function to format date
  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const messageDate = new Date(date);
    const messageDateOnly = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (messageDateOnly.getTime() === todayOnly.getTime()) {
      return "Today";
    } else if (messageDateOnly.getTime() === yesterdayOnly.getTime()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: messageDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  // helper function to check if date changed
  const isDateChanged = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.createdAt);
    const prevDate = new Date(prevMsg.createdAt);
    return currentDate.toDateString() !== prevDate.toDateString();
  };

  // initialize socket for this specific user
  useEffect(() => {
    if (!token || !userId) return;

    // Create a new socket instance for this user
    if (!socketRef.current || !socketRef.current.connected) {
      socketRef.current = io(backendUrl || "http://localhost:4000");

      socketRef.current.on("connect", () => {
        console.log("Connected to chat server for user:", userId);
        socketRef.current.emit("join", userId);
      });

      socketRef.current.on("receiveMessage", (msg) => {
        console.log("Received message:", msg);
        setMessages((prev) => {
          // Check if message already exists by ID
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
      // Disconnect socket when component unmounts or user changes
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token, userId, backendUrl]);

  // Load messages when chat opens
  useEffect(() => {
    if (!isOpen || !userId) return;

    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${backendUrl}/api/messages/${userId}`);
        setMessages(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [isOpen, userId, backendUrl]);

  // Send message
  const sendMessage = () => {
    if (!message.trim() || !socketRef.current) return;

    const messageText = message;

    // Emit to socket
    socketRef.current.emit("sendMessage", {
      room: userId,
      message: messageText,
      sender: "user",
    });

    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!token) return null;

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-40"
        title="Chat with Admin"
      >
        <img src={assets.profile_icon} alt="Chat" className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-24px)] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50 h-96 sm:h-[500px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Chat Support</h3>
              <p className="text-xs text-blue-100">Admin will respond soon</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-800 p-1 rounded transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center">
                  Start a conversation with our admin
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div key={msg._id || i}>
                    {/* Date Separator */}
                    {isDateChanged(msg, messages[i - 1]) && (
                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <p className="text-xs text-gray-500 font-medium px-2">
                          {formatDate(msg.createdAt)}
                        </p>
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div>
                    )}

                    {/* Message */}
                    <div
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
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
                placeholder="Type your message..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
