import { Elysia, t } from 'elysia';

const predictionRouter = new Elysia();

// @ts-ignore
predictionRouter.post('/prediction', async ({ body, main }) => {

  const { teamId, betLineId, matchId } = body;

  const predictionRes = await main().getPrediction(teamId, matchId, betLineId);


  return new Response(JSON.stringify(predictionRes), {
    status: 200
  });


}, {
  beforeHandle: (req) => {
    if (req.headers['x-api-key'] !== process.env.API_KEY) {
      throw new Error('Invalid API key');
    }
  },
  body: t.Object({
    matchId: t.Optional(t.Numeric({ description: 'Match id' }), true),
    betLineId: t.Optional(t.Numeric({ description: 'ID of selected bet line' }), true),
    teamId: t.Optional(t.Numeric({ description: 'Team id' }), true),
  }),
  response: {
    200: t.Object({
      message: t.String({
        description: 'The message of chatbot response'
      }),
      role: t.String({
        description: 'The role of chatbot response. Default: assistant'
      }),
      betLines: t.Array(t.Object({
        id: t.Number({ description: 'Bet line id' }),
        name: t.String({ description: 'Bet line name' }),
      }), {
        description: 'List of bet lines for user chosen.'
      }),
    }, {
      description: 'OK',
    }),
    400: t.Object({
    }, {
      description: 'Bad Request',
    }),
    500: t.Object({
      name: t.String(),
      message: t.String()
    }, {
      description: 'Internal Server Error',
    })
  },
  detail: {
    tags: ['Chatbot'],
    description: 'Return AI prediction based on selected matchId or teamID.<br> BetLineId is optional. If betLineId is not selected, prediction goes to WIN in series.'
  }
})


export default predictionRouter;