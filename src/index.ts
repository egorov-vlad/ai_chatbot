import { Elysia } from 'elysia';
import redisClient from './module/redisClient';
import router from './router';
import prisma from './db';

const app = new Elysia();
const PORT = process.env.PORT || 3000;


app.group('/api', (app) => app.use(router));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


redisClient.connect().catch((e) => {
  console.error(e);
});

prisma.$connect().catch((e) => {
  console.error(e);
});