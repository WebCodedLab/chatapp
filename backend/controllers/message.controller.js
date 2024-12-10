import Message from '../models/message.model.js';
import User from '../models/user.model.js';
import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken';

export const getAllUsers = async (req, res) => {
  
  const users = await User.find({ _id: { $ne: req.user._id } });
  res.status(200).json(users);
};

export const getConversation = async (req, res) => {
  try {
    const token = req.cookies.token;
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const conversation = await Message.find({
      $or: [
        { senderId: id, receiverId: userId },
        { senderId: userId, receiverId: id }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json({ conversation });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {

  const token = req.cookies.token;
  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  const userId = req.params.userId;
  const { text, image } = req.body;

  console.log(userId, id);

  // if(image) {
  //   const result = await cloudinary.uploader.upload(image);
  //   image = result.secure_url;
  // }

  const message = await Message.create({ senderId: id, receiverId: userId, text, image });
  res.status(200).json(message);
};

export const messageReaction = async (req, res) => {
  const { messageId, emoji } = req.body;
  const message = await Message.findByIdAndUpdate(messageId, { emoji }, { new: true });
  res.status(200).json(message);
}