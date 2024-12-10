import React, { useEffect, useState } from 'react'
import 'remixicon/fonts/remixicon.css'
import Sidebar from './Components/Sidebar';
import ChatList from './Components/ChatList';
import ChatArea from './Components/ChatArea';

const Dashboard = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-indigo-900 flex">
      <Sidebar />
      <div className="flex-1 flex">
        <ChatList setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
        <ChatArea selectedUser={selectedUser} />
      </div>
    </div>
  )
}

export default Dashboard