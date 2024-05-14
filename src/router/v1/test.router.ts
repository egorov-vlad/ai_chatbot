import { Elysia } from 'elysia';

const testRouter = new Elysia();

//@ts-ignore
testRouter.get('/test', async ({ main }) => {

  // const service = new CachedService();
  // const data = await service.getSupportTables();

  const data = await main().test();

  // const service = new PandascoreService();
  // const data = await service.getLiveMatches();
  // const live = data[0].id;
  // const matchData = await service.getAllDataByID(live);


  return new Response(JSON.stringify({
    data
  }), {
    status: 200
  })
});

export default testRouter;