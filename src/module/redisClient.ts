import { createClient } from 'redis';
import logger from './logger';

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('connect', () => {
  logger.info('Redis connected');
})

redisClient.on('error', (err: any) => {
  logger.info('Redis error: ' + err);
})

export default redisClient;