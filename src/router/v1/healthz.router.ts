import { Elysia } from 'elysia';

const healthzRouter = new Elysia();

healthzRouter.get('/healthz', async () => {
  return new Response('OK', { status: 200 });
});

export default healthzRouter;