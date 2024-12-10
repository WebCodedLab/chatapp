import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

const Register = () => {
  const navigate = useNavigate();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
      formData.append('folder', 'profilePics');

      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      if (uploadResponse.data?.url) {
        setProfilePicture(uploadResponse.data.url);
        console.log(uploadResponse.data.url);
        
        setUploadSuccess(true);
      } else {
        throw new Error('Upload failed - no URL received');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const formData = {
        fullname,
        email,
        password,
        profilePicture
      };

      const registerResponse = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, formData, {withCredentials: true});
      
      if (registerResponse.data) {
        navigate('/login');
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-gray-800 rounded-lg shadow-xl p-6">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">Create Account</h2>
          <p className="text-sm text-gray-400">Join ConnectHub today</p>
        </div>
        
        <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
          <div className="space-y-3">
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="block w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-sm"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-sm"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-300 mb-1">
                Profile Picture
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={(e) => handleProfilePictureChange(e)}
                  className="block w-full text-sm text-gray-300
                  file:mr-2 file:py-1.5 file:px-3
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-indigo-600 file:text-white
                  hover:file:bg-indigo-700
                  disabled:opacity-50"
                  disabled={isUploading}
                />
                {isUploading && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                  </div>
                )}
                {uploadSuccess && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                )}
              </div>
              {profilePicture && (
                <div className="mt-2 relative w-16 h-16 rounded-full overflow-hidden border border-indigo-500">
                  <img src={profilePicture} alt="Profile Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-2 px-4 mt-4 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
            Login here
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Register