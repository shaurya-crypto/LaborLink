import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { env } from '../config/env';

// Cloudinary config expects CLOUDINARY_URL in process.env, which dotenv sets automatically, 
// but we can explicitly set it to be safe.
cloudinary.config({
  cloudinary_url: env.CLOUDINARY_URL
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'laborlink/temp';
    const reqFolder = (req.query.folder as string) || (req.body.folder as string);
    
    const allowedFolders = ['profiles', 'employers', 'chats', 'jobs', 'verification', 'resumes'];
    if (allowedFolders.includes(reqFolder)) {
      folder = `laborlink/${reqFolder}`;
    }

    return {
      folder: folder,
      format: file.mimetype === 'application/pdf' ? 'pdf' : 'webp',
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      transformation: file.mimetype !== 'application/pdf' ? [{ width: 1000, crop: 'limit', quality: 'auto' }] : []
    };
  },
});

export const uploadMedia = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and PDF are allowed.'));
    }
  }
});
