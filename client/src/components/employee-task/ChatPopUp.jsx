// ChatPopup.js
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import socket from "../utils/socket";

const ChatPopup = ({ projectId, isOpen, onClose }) => {
  const { user } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      socket.connect();
      socket.emit("joinRoom", { projectId, userId: user._id });
      socket.on("receiveMessage", (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      });
    }
    return () => {
      socket.disconnect();
    };
  }, [isOpen, projectId, user._id]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMessage = { text: message, userId: user._id };
    socket.emit("sendMessage", { projectId, message: newMessage });
    setMessages((prev) => [...prev, { ...newMessage, timestamp: new Date() }]);
    setMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h3 className="text-lg font-semibold mb-2">Project Chat</h3>
        <div className="h-64 overflow-y-auto border p-2 rounded-md">
          {messages.map((msg, index) => (
            <div key={index} className={`p-2 mb-1 rounded-md ${msg.userId === user._id ? "bg-blue-200 self-end" : "bg-gray-200"}`}>
              <span>{msg.text}</span>
              <small className="block text-xs text-gray-600">{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
          ))}
        </div>
        <div className="flex mt-2 gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-md"
          />
          <button onClick={sendMessage} className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600">Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
