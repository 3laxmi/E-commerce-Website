import React, { useEffect, useState, useContext, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { ShopContext } from "../../context/ShopContext";

let socket = null;

const AdminChat = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const selectedUserRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper function to format date
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

  // Helper function to check if date changed
  const isDateChanged = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.createdAt);
    const prevDate = new Date(prevMsg.createdAt);
    return currentDate.toDateString() !== prevDate.toDateString();
  };

  // Keep selectedUser in ref for socket listener
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // Initialize socket ONCE
  useEffect(() => {
    if (!token) return;

    if (!socket || !socket.connected) {
      socket = io(backendUrl || "http://localhost:4000");

      socket.on("connect", () => {
        console.log("Admin connected to chat server");
      });

      socket.on("receiveMessage", (msg) => {
        console.log("Admin received message:", msg, "Current room:", selectedUserRef.current);
        
        // Only add message if it's for the currently selected user
        if (selectedUserRef.current && msg.room === selectedUserRef.current) {
          setMessages((prev) => {
            // Check if message already exists by ID
            const exists = prev.some((m) => m._id === msg._id);
            if (exists) return prev;
            return [...prev, msg];
          });
        }
      });

      socket.on("disconnect", () => {
        console.log("Admin disconnected from chat server");
      });
    }

    return () => {
      // Don't disconnect on unmount to keep socket alive
    };
  }, [token, backendUrl]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/user/list`,
          {},
          { headers: { token } }
        );
        if (response.data.success) {
          setUsers(response.data.users.filter((u) => u.role === "user"));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, [token, backendUrl]);

  // Load messages and join room when user is selected
  useEffect(() => {
    if (!selectedUser) return;

    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/messages/${selectedUser}`
        );
        setMessages(response.data);
        
        // Join the room after loading messages
        if (socket && socket.connected) {
          socket.emit("join", selectedUser);
          console.log("Admin joined room:", selectedUser);
        } else {
          console.log("Socket not connected yet");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [selectedUser, backendUrl]);

  // Send message
  const sendMessage = () => {
    if (!message.trim() || !socket || !selectedUser) return;

    const messageText = message;

    console.log("Admin sending message to room:", selectedUser);

    // Emit to socket
    socket.emit("sendMessage", {
      room: selectedUser,
      message: messageText,
      sender: "admin",
    });

    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Chat Support</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Users List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Users ({users.length})
            </h2>
          </div>
          <div className="overflow-y-auto flex-1">
            {users.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">No users found</p>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => setSelectedUser(user._id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    selectedUser === user._id
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 border-b border-gray-200 rounded-t-lg">
                <h2 className="text-lg font-bold">
                  {users.find((u) => u._id === selectedUser)?.name || "User"}
                </h2>
                <p className="text-sm text-blue-100">
                  {users.find((u) => u._id === selectedUser)?.email}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center">
                      No messages yet. Start the conversation!
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
                          className={`flex ${
                            msg.sender === "admin" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs px-4 py-3 rounded-lg ${
                              msg.sender === "admin"
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-gray-300 text-gray-800 rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm break-words">{msg.message}</p>
                            <p className="text-xs mt-2 opacity-70">
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
              <div className="border-t border-gray-200 p-6 bg-white rounded-b-lg">
                <div className="flex gap-3">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your response..."
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">
                Select a user to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
