import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-gray-800 shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">ConnectHub</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="px-6 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                Login
              </Link>
              <Link to="/register" className="px-6 py-2 text-indigo-400 border-2 border-indigo-400 rounded-lg hover:bg-gray-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
  )
}

export default Navbar