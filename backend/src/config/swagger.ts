import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { logger } from './logger';

export const setupSwagger = (app: Application) => {
  try {
    const file = fs.readFileSync(path.join(__dirname, '../../swagger/swagger.yaml'), 'utf8');
    const swaggerDocument = YAML.parse(file);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    logger.info('📄 Swagger documentation enabled at /api-docs');
  } catch (error) {
    logger.warn('⚠️ Swagger documentation could not be loaded');
  }
};
