import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  emoji: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Add index for faster querying of conversations
messageSchema.index({ senderId: 1, receiverId: 1 });

// Method to get conversation between two users
messageSchema.statics.getConversation = async function(user1Id, user2Id) {
  return this.find({
    $or: [
      { senderId: user1Id, receiverId: user2Id },
      { senderId: user2Id, receiverId: user1Id }
    ]
  }).sort({ createdAt: 1 });
};


const Message = mongoose.model('Message', messageSchema);

export default Message;
