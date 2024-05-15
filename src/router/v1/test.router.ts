import { Elysia } from 'elysia';

const testRouter = new Elysia();

//@ts-ignore
testRouter.get('/test', async ({ main }) => {
  const data = await main().test();

  return new Response(JSON.stringify({
    data
  }), {
    status: 200
  })
},{
  detail:{
    tags: ['Test'],
    description: 'Test'
  }
});

export default testRouter;