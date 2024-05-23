import { Elysia, t } from 'elysia';

export const shortPredictionRouter = new Elysia();

//@ts-ignore
shortPredictionRouter.post('/shortPrediction', async ({ body, main }) => {
  const { matchId } = body;
  const res = await main().shortPrediction(matchId);

  return res;
},
  {
    body: t.Object({
      matchId: t.Numeric({
        description: 'The id of the match'
      })
    }),
    response: {
      200: t.Object({
        message: t.String({ description: 'The response from the chatbot' }),
      }, {
        description: 'OK'
      }),
      400: t.String({
        description: 'Bad request'
      }),
      500: t.String({
        description: 'Internal Server Error'
      })
    },
    detail: {
      tags: ['Chatbot'],
      description: 'Return short AI prediction based on selected matchId.'
    },
    beforeHandle: (req) => {
      if (req.headers['x-api-key'] !== process.env.API_KEY) {
        throw new Error('Invalid API key');
      }
    }
  },

)