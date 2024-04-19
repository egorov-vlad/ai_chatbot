import { Elysia, t } from 'elysia';
import SupportService from '../../service/support.service';

const teamsRouter = new Elysia();
const supService = new SupportService();

teamsRouter.get('/teams', async (req) => {
  const teams = await supService.getTeams();

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
    200: t.Object({
      teams: t.Array(t.Object({
        teamId: t.Number(),
        name: t.String()
      }),
        {
          description: 'List of teams'
        })
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
    description: 'Return list of teams who play today'
  }
})

export default teamsRouter;