import { Elysia, t } from 'elysia';

export const matchDataRouter = new Elysia();

//@ts-ignore
matchDataRouter.get('/matchData', async ({ main, query }) => {

  const res = await main().getMatchData(query.id);

  return res

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