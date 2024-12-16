import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setMessages, addMessage } from "./redux/features/chatSlice";
import axiosInstance from "./helpers/axiosInstance";

const socket = io("https://chatapp-r106.onrender.com");

const App = () => {
  const [newMessage, setNewMessage] = useState("");
  const messages = useSelector((state) => state.chat.messages);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null); // Ref for auto-scroll

  // Get All Msg
  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get("/messages");
      dispatch(setMessages(res.data));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Listen for new messages via Socket.IO
    socket.on("newMessage", (message) => {
      dispatch(addMessage(message));
    });

    return () => socket.off("newMessage");
  }, [dispatch]);

  // New Msg
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await axiosInstance.post("/new/messages", {
        text: newMessage,
      });
      setNewMessage("");
      socket.emit("sendMessage", res.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100 p-4'>
      <div className='w-full max-w-md bg-white shadow-md rounded-md p-4'>
        <h1 className='text-2xl font-bold text-center mb-4'>
          Chat Application
        </h1>
        <div className='container border border-gray-300 rounded-md p-3 h-72 overflow-y-auto'>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 flex ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`p-2 rounded-md ${
                  index % 2 === 0
                    ? "bg-blue-100 text-left"
                    : "bg-green-100 text-right"
                }`}
                style={{ maxWidth: "100%" }}
              >
                <p className='text-gray-800 '>{message.text}</p>
                <span className='text-sm text-gray-500'>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Auto-scroll reference */}
        </div>
        <div className='mt-4 flex items-center'>
          <input
            type='text'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder='Type your message...'
            className='flex-grow border border-gray-300 rounded-md px-3 py-2 mr-2'
          />
          <button
            onClick={sendMessage}
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
