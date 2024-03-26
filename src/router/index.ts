import { Elysia } from 'elysia';
import messageRouter from './v1/message.router';

const router = new Elysia();

router.group('/api', (router) =>
  router.group('/v1', (router) => router.use(messageRouter)));

export default router;