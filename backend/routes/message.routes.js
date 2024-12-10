import express from 'express';
import protectRoute from '../middlewares/auth.middleware.js';
import { getAllUsers, getConversation, sendMessage, messageReaction } from '../controllers/message.controller.js';

const router = express.Router();
router.get('/get-all-users', protectRoute, getAllUsers);

router.get('/get-conversation/:userId', protectRoute, getConversation);

router.post('/send-message/:userId', protectRoute, sendMessage);

router.post('/message-reaction', protectRoute, messageReaction);

export default router;
