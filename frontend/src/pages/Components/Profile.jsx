import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = ({ onClose }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/get-user`, {
          withCredentials: true,
        });
        setFullname(response.data.fullname);
        setEmail(response.data.email);
        setProfilePicture(response.data.profilePicture);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChangeAndUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setProfilePicture(reader.result);
        
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/user/upload-profile-picture`,
            { file: reader.result },
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );

          if (response.status === 200) {
            setProfilePicture(response.data.user.profilePicture);
          }
        } catch (error) {
          console.error("Failed to upload image:", error);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-100">Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
            aria-label="Close Profile"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        <div className="flex flex-col items-center mb-6">
          <img
            src={profilePicture || 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg'}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover mb-4 shadow-md"
          />
          <input
            type="file"
            onChange={handleFileChangeAndUpload}
            className="hidden"
            id="fileInput"
          />
          <button
            onClick={() => document.getElementById("fileInput").click()}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300"
          >
            Change Profile Picture
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 font-medium">Full Name</label>
          <input
            type="text"
            value={fullname}
            readOnly
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 font-medium">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
