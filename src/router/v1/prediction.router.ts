import { Elysia, t } from 'elysia';
import logger from '../../module/logger';

const predictionRouter = new Elysia();

// @ts-ignore
predictionRouter.post('/prediction', async ({ body, main }) => {

  const { teamId, betLineId, matchId, threadId } = body;

  const predictionRes = await main().getPrediction(teamId, matchId, betLineId, threadId);

  return predictionRes;
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
    threadId: t.Optional(t.String({ description: 'Thread id' }), true),
    // history: t.Optional(t.Array(t.Object({
    //   role: t.String({ description: 'The role of chatbot response. Default: user' }),
    //   content: t.String({ description: 'The message of chatbot response' }),
    // })))
  }),
  response: {
    200: t.Object({
      message: t.String({
        description: 'The message of chatbot response'
      }),
      threadId: t.String({
        description: 'Thread id'
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