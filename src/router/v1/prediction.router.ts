import { Elysia, t } from 'elysia';
import { CachedService } from '../../service/cached.service';

const predictionRouter = new Elysia();

predictionRouter.post('/prediction', async (req) => {
  const { teamId, betLineId, matchId } = req.body;

  const prediction = new CachedService();
  let predictionRes: any = null;

  //prediction by matchId
  //prediction by matchId and betLineId
  if (matchId) {
    predictionRes = await prediction.getPredictionByMatchId(matchId, betLineId);
  }

  //prediction by teamId
  //prediction by teamId and betLineId
  if (teamId) {
    predictionRes = await prediction.getPredictionByTeamId(teamId, betLineId);
  }

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
    betLineId: t.Optional(t.Numeric({ description: 'ID of selected bet line' })),
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
      betLineId: t.Numeric({ description: 'ID of selected bet line' }),
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
    description: 'Return AI prediction based on selected teams.<br> If team id 2 is not provided, the prediction get upcoming match of team id 1'
  }
})


export default predictionRouter;