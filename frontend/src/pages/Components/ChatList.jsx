import React from 'react'
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { io } from "socket.io-client";

const ChatList = ({ setSelectedUser, selectedUser }) => {

  const [users, setUsers] = useState([]);
  const { user: loggedInUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/message/get-all-users`, {
          withCredentials: true
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

    const formatLastSeen = (lastSeen) => {
      const date = new Date(lastSeen);
      const now = new Date();
      const diff = now - date;
  
      // Less than a minute
      if (diff < 60000) return 'Just now';
      // Less than an hour
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      // Less than a day
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      // Otherwise show date
      return date.toLocaleDateString();
    };

    useEffect(() => {

      const newSocket = io(import.meta.env.VITE_BASE_URL, {
        withCredentials: true,
      });

      newSocket.on("user_status_change", (updatedUser) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === updatedUser._id ? { ...user, isOnline: updatedUser.isOnline, lastSeen: updatedUser.lastSeen } : user
          )
        );
      });

      return () => {
        newSocket.off("user_status_change");
      };
    }, [socket]);

  return (
    <div className="w-96 lg:w-80 md:w-72 sm:w-20 border-r border-gray-800/50 p-6 transition-all duration-300">
          <div className="mb-8">
            <div className="relative">
              <h1 className="text-2xl font-bold text-gray-100 hidden sm:block">Chats</h1>
              <i className="ri-message-3-line text-2xl text-gray-300 block sm:hidden"></i>
            </div>
          </div>

          <div className="space-y-4">
            {users
              .sort((a, b) => (a.fullname === loggedInUser?.fullname ? -1 : b.fullname === loggedInUser?.fullname ? 1 : 0))
              .map((user) => (
                <div 
                  key={user._id} 
                  className={`chat-item group p-4 flex items-center space-x-4 rounded-xl hover:bg-indigo-500/10 cursor-pointer transition-all duration-300 ${
                    selectedUser?._id === user._id ? 'bg-indigo-500/10' : ''
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={!user.profilePicture ? 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg' : user.profilePicture}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-700 group-hover:border-indigo-500 transition-all duration-300 shadow-lg"
                      alt="Profile"
                    />
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${user.isOnline ? 'bg-green-500' : 'bg-gray-500'} rounded-full border-2 border-gray-900 shadow-lg`}></div>
                  </div>
                  <div className="flex-1 hidden sm:block min-w-0">
                    <h3 className="text-gray-100 font-medium mb-0.5">
                      {user.fullname === loggedInUser?.fullname ? "You" : user.fullname}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {user.isOnline ? 'Online' : `Last seen ${formatLastSeen(user.lastSeen)}`}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
  )
}

export default ChatList