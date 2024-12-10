import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';

const Sidebar = () => {
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();
    const handleLogout = async () => {
        const logoutResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`, {
          withCredentials: true
        });
    
        if (logoutResponse.status === 200) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
  return (
    <div>
      <div className="w-20 h-screen lg:w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg border-r border-gray-700 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-center lg:justify-start space-x-3 mb-12">
            <div className="p-3 bg-indigo-600 rounded-full shadow-md">
              <i className="ri-chat-smile-2-fill text-3xl text-white"></i>
            </div>
            <span className="hidden lg:block text-white text-xl font-bold">ConnectHub</span>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-700">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-full flex items-center p-4 space-x-4 text-gray-200 hover:bg-indigo-600 hover:text-white rounded-lg transition-all duration-300 shadow-sm">
            <i className="ri-user-line text-2xl"></i>
            <span className="hidden lg:block font-semibold">Profile</span>
          </button>
          <button onClick={handleLogout} className="w-full flex items-center p-4 space-x-4 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-300 shadow-sm">
            <i className="ri-logout-box-line text-2xl"></i>
            <span className="hidden lg:block font-semibold">Logout</span>
          </button>
          {showProfile && <Profile onClose={() => setShowProfile(false)} />}
        </div>
      </div>
    </div>
  )
}

export default Sidebar