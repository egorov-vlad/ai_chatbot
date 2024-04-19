import { Elysia, t } from 'elysia';
import SupportService from '../../service/support.service';

const matchesRouter = new Elysia();
const suppService = new SupportService();

matchesRouter.get('/matches', async ({ query }) => {

  //search matches by team id
  const data = await suppService.getMatches(query.teamId, query.matchTime);

  return new Response(JSON.stringify(data), {
    status: 200
  })
}, {
  query: t.Object({
    teamId: t.Optional(t.Numeric({
      description: 'Team id, if not set, return all matches'
    })),
    matchTime: t.Optional(t.Enum({
      today: 'today',
      tomorrow: 'tomorrow',
    }, {
      description: 'Match time option. Available values: today, tomorrow. Default: today'
    }))
  }),
  response: {
    200: t.Object({
      EventUrl: t.String({ description: 'Event url' }),
      team1: t.String({ description: 'Team 1 name' }),
      team2: t.String({ description: 'Team 2 name' }),
      id1: t.Number({ description: 'Team 1 id' }),
      id2: t.Number({ description: 'Team 2 id' }),
      odds: t.Object({}, {
        description: "Odd of the match. If odds close this params will be empty string('')"
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
  beforeHandle: (req) => {
    if (req.headers['x-api-key'] !== process.env.API_KEY) {
      throw new Error('Invalid API key');
    }
  },
  detail: {
    tags: ['Chatbot'],
    description: 'Return list of matches'
  }
});


export default matchesRouter;