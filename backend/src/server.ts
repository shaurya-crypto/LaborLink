import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDB } from './config/database';
import { initializeSocketServer } from './socket/SocketServer';

const startServer = async () => {
  // Connect to Database
  await connectDB();

  // Start Express Server
  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });

  // Initialize Socket.IO
  initializeSocketServer(server);

  // Keep-Alive Ping for Render Free Tier (pings every 10 minutes)
  if (process.env.RENDER_EXTERNAL_URL) {
    const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes
    setInterval(() => {
      const url = `${process.env.RENDER_EXTERNAL_URL}/api/v1/health`;
      fetch(url)
        .then((res) => {
          if (res.ok) logger.info(`💓 Keep-alive ping successful: ${url}`);
          else logger.warn(`⚠️ Keep-alive ping returned status: ${res.status}`);
        })
        .catch((err) => logger.error(`❌ Keep-alive ping failed: ${err.message}`));
    }, PING_INTERVAL);
  }

  // Handle Unhandled Rejections
  process.on('unhandledRejection', (err: any) => {
    logger.error(`❌ Unhandled Rejection: ${err.name} - ${err.message}`);
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle Uncaught Exceptions
  process.on('uncaughtException', (err: Error) => {
    logger.error(`❌ Uncaught Exception: ${err.name} - ${err.message}`);
    process.exit(1);
  });
};

startServer();
