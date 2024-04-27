import { Elysia } from 'elysia';
import { PuppeteerService } from '../../service/puppeter.service';
const testRouter = new Elysia();

testRouter.get('/test', async () => {
  const service = new PuppeteerService();
  await service.getPageInfo();

  return new Response('Hello, World!')
});

export default testRouter;