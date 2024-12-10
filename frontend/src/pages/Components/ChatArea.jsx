import React, { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";

const ChatArea = ({ selectedUser }) => {
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BASE_URL, {
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/message/get-conversation/${selectedUser._id}`,
          {
            withCredentials: true,
          }
        );
        setMessages(response.data.conversation);
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };
    if (selectedUser) {
      fetchConversation();
    }
  }, [selectedUser]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/message/send-message/${selectedUser._id}`,
        { text: message },
        { withCredentials: true }
      );

      // Emit the message through socket
      socket.emit("send_message", {
        recipientId: selectedUser._id,
        message: response.data,
      });

      // Update local messages state
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File selected:", file);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleEmojiClick = async (messageId, emoji) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/message/message-reaction`,
        { messageId, emoji },
        { withCredentials: true }
      );

      // Update local messages state with the new reaction
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, emoji: response.data.emoji } : msg
        )
      );
    } catch (error) {
      console.error("Error sending emoji reaction:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900/30 h-screen">
      {selectedUser ? (
        <>
          <div className="p-6 border-b border-gray-800/50 flex items-center justify-between backdrop-blur-lg">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={selectedUser.profilePicture || 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg'}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-700 shadow-lg"
                  alt="Profile"
                />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <h3 className="text-gray-100 font-medium text-lg">
                  {selectedUser.fullname}
                </h3>
                <p className="text-sm text-indigo-400 font-medium">{user.isOnline ? "Online" : "Offline"}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="p-3 text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all duration-300">
                <i className="ri-phone-line text-xl"></i>
              </button>
              <button className="p-3 text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all duration-300">
                <i className="ri-vidicon-line text-xl"></i>
              </button>
              <button className="p-3 text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all duration-300">
                <i className="ri-more-2-fill text-xl"></i>
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 h-0 scrollbar-hide">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start space-x-4 ${
                  msg.senderId === selectedUser._id ? "" : "justify-end"
                }`}
                onMouseEnter={() => setHoveredMessageId(msg._id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                {msg.senderId === selectedUser._id && (
                  <img
                    src={selectedUser.profilePicture || 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-700 shadow-lg"
                    alt="Profile"
                  />
                )}
                <div className="relative">
                  <div
                    className={`${
                      msg.senderId === selectedUser._id
                        ? "bg-gray-800/50"
                        : "bg-indigo-500/50"
                    } p-4 rounded-xl text-gray-100`}
                  >
                    <p>{msg.text}</p>
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Message attachment"
                        className="mt-2 rounded-lg max-w-xs"
                      />
                    )}
                    {msg.emoji && (
                      <div className="mt-2 text-2xl">
                        {msg.emoji}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {hoveredMessageId === msg._id && (
                    <div className={`absolute top-0 ${msg.senderId === selectedUser._id ? "right-2" : "right-10"} flex space-x-2 bg-gray-800 p-2 rounded-lg shadow-lg`}>
                      {["👍", "❤️", "😂", "😮", "😢", "👏"].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleEmojiClick(msg._id, emoji)}
                          className="text-xl"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {msg.senderId !== selectedUser._id && (
                  <img
                    src={user.profilePicture || 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-700 shadow-lg"
                    alt="Profile"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-6 border-t border-gray-800/50 backdrop-blur-lg">
            <div className="flex space-x-4">
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <button
                  onClick={handleAttachmentClick}
                  className="p-3 text-gray-300 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all duration-300"
                >
                  <i className="ri-attachment-2 text-xl"></i>
                </button>
              </div>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 transition-all duration-300"
              />
              <button
                onClick={handleSendMessage}
                className="p-3 text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/25"
              >
                <i className="ri-send-plane-fill text-xl"></i>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <i className="ri-chat-3-line text-6xl text-gray-500"></i>
          <p className="text-gray-500 text-lg">
            Select a chat to start messaging
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
