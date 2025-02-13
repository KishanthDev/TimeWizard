import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Send } from "lucide-react";
import { useSelector } from "react-redux";

const socket = io("http://localhost:3092"); // Change to your backend URL

const GeneralChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("joinGeneralChat", { userId: user._id });

    socket.on("receiveGeneralMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receiveGeneralMessage");
    };
  }, [user]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      text: message,
      userId: user._id,
      username: user.username, // Assuming user has a name field
      timestamp: new Date(),
    };

    socket.emit("sendGeneralMessage", { message: newMessage });

    setMessage("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col w-full dark:border border-2 border-gray-400 bg-gray-100 dark:bg-gray-900 h-[calc(100vh-80px)] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4  bg-blue-600  text-white text-lg font-semibold text-center shadow-md">
        General Chat
      </div>

      {/* Messages Section (Fixed Height) */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.userId === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.userId === user._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              }`}
            >
              <p className="text-xs font-semibold">{msg.username}</p>
              <p>{msg.text}</p>
              <span className="text-xs opacity-60 block text-right">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Section (Fixed Bottom) */}
      <div className="p-3 border-t flex items-center bg-white dark:bg-gray-800 sticky bottom-0">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border border-gray-300 dark:border-gray-600"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-3 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          onClick={sendMessage}
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};

export default GeneralChat;
