import { Elysia, t } from 'elysia';
import { CachedService } from '../../service/cached.service';

const teamsRouter = new Elysia();

teamsRouter.get('/teams', async (req) => {
  const service = new CachedService();
  const teams = await service.getWinlineTeams();

  return new Response(JSON.stringify(teams), {
    status: 200
  })
}, {
  beforeHandle: (req) => {
    if (req.headers['x-api-key'] !== process.env.API_KEY) {
      throw new Error('Invalid API key');
    }
  },
  response: {
    200: t.Array(t.Object({
      teamId: t.Number(),
      name: t.String()
    }, {
      description: 'Return list of teams who play today'
    }), {
      description: 'OK'
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
    description: 'Return list of teams who play today'
  }
})

export default teamsRouter;