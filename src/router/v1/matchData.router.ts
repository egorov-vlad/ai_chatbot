import { Elysia, t } from 'elysia';

export const matchDataRouter = new Elysia();

//@ts-ignore
matchDataRouter.get('/matchData', async ({ main, query, set }) => {

  const data = await main().getMatchData(query.id);

  set.status = 200;
  return new Response(JSON.stringify(data))
}, {
  query: t.Object({
    id: t.Numeric({ description: 'The id of the match' })
  }),
  beforeHandle: (req) => {
    if (req.headers['x-api-key'] !== process.env.API_KEY) {
      throw new Error('Invalid API key');
    }
  },
  detail: {
    tags: ['Test'],
    description: 'Return the data of the match by id',
  }
})