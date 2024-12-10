import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {


  


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const { user, setUser } = useContext(AuthContext);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      email,
      password
    }

    try {
        const loginResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`, formData, { withCredentials: true});
        if (loginResponse.status === 200) {
            // Store both token and user data
            localStorage.setItem('token', loginResponse.data.token);
            setUser(loginResponse.data.user);
            navigate('/dashboard');
        }
    } catch (error) {
        toast.error(error.response?.data?.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full backdrop-blur-lg bg-gray-800/80 rounded-2xl shadow-2xl p-10 border border-gray-700">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-3">Welcome Back</h2>
          <p className="text-gray-400">Sign in to continue to ConnectHub</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg bg-gray-700/50 border-2 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2 focus:ring-opacity-50 transition-all duration-300 text-white placeholder-gray-400"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg bg-gray-700/50 border-2 border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2 focus:ring-opacity-50 transition-all duration-300 text-white placeholder-gray-400"
                placeholder="••••••••"
                required
              />
              <Link to="/forgot-password" className="absolute right-0 -bottom-6 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 shadow-lg hover:shadow-indigo-500/25"
            >
              Sign In
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Create one now
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login