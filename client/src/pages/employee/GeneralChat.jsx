import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Send, Smile } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getGeneralMessages } from "../../slices/messageSlice";
import { Helmet } from "react-helmet";
import EmojiPicker from "emoji-picker-react";

const socket = io("http://localhost:3092");

const GeneralChat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { chats } = useSelector((state) => state.messages);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    dispatch(getGeneralMessages());
  }, [dispatch]);

  useEffect(() => {
    setMessages(chats);
  }, [chats]);

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
      username: user.username,
      timestamp: new Date(),
    };
    socket.emit("sendGeneralMessage", { message: newMessage });
    setMessage("");
  };

  const addEmoji = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col w-full border-2 mt-3 border-gray-400 bg-gray-100 dark:bg-gray-900 h-[calc(100vh-100px)] overflow-hidden">
      <Helmet>
        <title>Chat • TimeWizard</title>
      </Helmet>
      <div className="p-4 bg-gray-800 text-white text-lg font-semibold text-center shadow-md">
        General Chat
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 backdrop-blur-lg bg-black/30">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.userId === user._id ? "justify-end" : "justify-start"}`}>
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
      <div className="p-3 border-t flex items-center bg-white dark:bg-gray-800 sticky bottom-0 relative">
        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="mr-2 p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
          <Smile size={24} />
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-3  rounded-lg shadow-lg">
            <EmojiPicker onEmojiClick={addEmoji} />
          </div>
        )}
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none border border-gray-300 dark:border-gray-600"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="ml-3 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700" onClick={sendMessage}>
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};

export default GeneralChat;
