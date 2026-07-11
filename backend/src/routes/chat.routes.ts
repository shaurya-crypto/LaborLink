import { Router } from 'express';
import { chatController } from '../controllers/ChatController';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/conversations', chatController.getConversations);
router.get('/messages/:conversationId', chatController.getMessages);
router.post('/send', chatController.sendMessage);
router.patch('/read/:conversationId', chatController.markAsRead);

export default router;
