import { Router } from 'express';
import { notificationController } from '../controllers/NotificationController';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', notificationController.getNotifications);
router.patch('/read', notificationController.markAsRead);

export default router;
