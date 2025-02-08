import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../utils/socket";
import { fetchMessages, addMessage } from "../../slices/messageSlice";

const ChatPopup = ({ projectId, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { messages, isLoading } = useSelector((state) => state.messages);
  const [message, setMessage] = useState("");

  const messagesEndRef = useRef(null); // Create ref

  // Scroll to the bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Runs when messages change

  // Fetch old messages when chat opens
  useEffect(() => {
    if (isOpen) {
      socket.connect();
      socket.emit("joinRoom", { projectId, userId: user._id });

      dispatch(fetchMessages(projectId));

      socket.on("receiveMessage", (newMessage) => {
        // Prevent duplicate messages by checking Redux store
        if (!messages.some((msg) => msg._id === newMessage._id)) {
          dispatch(addMessage(newMessage)); // Add to Redux state only if it's unique
        }
      });
      
    }

    return () => {
      socket.disconnect();
    };
  }, [isOpen, projectId, user._id, dispatch]);

  // Send message function
  const sendMessage = () => {
    if (!message.trim()) return;
  
    const newMessage = { text: message, userId: user._id, projectId };
  
    // Emit message via socket
    socket.emit("sendMessage", { projectId, message: newMessage });
  
    // Don't update Redux immediately; wait for socket response
    setMessage(""); // Clear input field
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          onClick={()=>onClose()}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h3 className="text-lg font-semibold mb-2">Project Chat</h3>

        {/* Messages Container */}
        <div className="h-64 overflow-y-auto border p-2 rounded-md flex flex-col gap-2">
          {isLoading ? 
            <p className="text-gray-500 text-center">Loading messages...</p>
           : Array.isArray(messages) && messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.userId === user._id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-2 mb-1 rounded-md max-w-xs ${
                    msg.userId === user._id ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-black rounded-bl-none"
                  }`}
                >
                  <strong className="block text-sm">
                    {msg.userId === user._id ? "Me" : msg.user}
                  </strong>
                  <span>{msg.text}</span>
                  <small className="block text-xs text-gray-300">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No messages yet.</p>
          )}
          
          {/* Empty div for auto-scroll */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className="flex mt-2 gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-md"
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
