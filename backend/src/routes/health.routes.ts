import { Router, Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import mongoose from 'mongoose';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json(ApiResponse.success('Server is healthy', {
    uptime: process.uptime(),
    db: dbStatus,
    timestamp: new Date().toISOString()
  }));
});

router.get('/status', (req: Request, res: Response) => {
  res.json(ApiResponse.success('API is running', {
    environment: process.env.NODE_ENV,
    memoryUsage: process.memoryUsage()
  }));
});

router.get('/version', (req: Request, res: Response) => {
  res.json(ApiResponse.success('Version info', {
    version: '1.0.0'
  }));
});

export default router;
