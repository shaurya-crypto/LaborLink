import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';

export class UploadController {
  public uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json(ApiResponse.error('No file uploaded'));
      }

      res.status(200).json(ApiResponse.success('File uploaded successfully', {
        url: req.file.path,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      }));
    } catch (error) {
      next(error);
    }
  };
}

export const uploadController = new UploadController();
