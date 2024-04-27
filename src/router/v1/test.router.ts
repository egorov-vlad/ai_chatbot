import { Elysia } from 'elysia';
import { PuppeteerService } from '../../service/puppeter.service';
import { CachedService } from '../../service/cached.service';
const testRouter = new Elysia();

testRouter.get('/test', async () => {
  // const service = new PuppeteerService();
  // await service.getPageInfo();

  const service = new CachedService();
  const data = await service.getSupportTables();

  return new Response(JSON.stringify({
    data
  }), {
    status: 200
  })
});

export default testRouter;