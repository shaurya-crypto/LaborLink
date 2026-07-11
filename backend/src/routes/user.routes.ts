import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth.middleware';
import * as userVal from '../validators/user.validator';

const router = Router();
const userController = new UserController();

// All user routes require authentication
router.use(requireAuth);

router.get('/me', userController.getMe);
router.put('/profile', validate(userVal.updateProfileSchema), userController.updateProfile);
router.post('/complete-onboarding', userController.completeOnboarding);
router.delete('/', userController.deleteAccount);

export default router;
