import { Elysia } from 'elysia';
import { CachedService } from '../../service/cached.service';
const testRouter = new Elysia();

testRouter.get('/test', async () => {

  const service = new CachedService();
  const data = await service.getAllMatches();

  return new Response(JSON.stringify({
    data
  }), {
    status: 200
  })
});

export default testRouter;