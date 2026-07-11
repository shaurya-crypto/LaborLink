import { Router } from 'express';
import { uploadController } from '../controllers/UploadController';
import { requireAuth } from '../middleware/auth.middleware';
import { uploadMedia } from '../services/MediaService';

const router = Router();

router.use(requireAuth);

router.post('/', uploadMedia.single('file'), uploadController.uploadFile);

export default router;
