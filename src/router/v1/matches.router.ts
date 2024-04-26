import { Elysia, t } from 'elysia';
import { CachedService } from '../../service/cached.service';

const matchesRouter = new Elysia();


//return list of matches
//If teamId is set, return list of matches for this team
//If matchTime is set, return list of matches for this time
matchesRouter.get('/matches', async ({ query }) => {
  const service = new CachedService();

  const data = await service.getWinlineMatchesByTeamIdAndTime(query.teamId, query.matchTime);

  if (data.length === 0) {
    return new Response(JSON.stringify({
      message: 'Array of matches is empty',
      name: 'No matches found'
    }), {
      status: 500
    })
  }

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
      id: t.String({ description: 'Match id' }),
      EventUrl: t.String({ description: 'Event url' }),
      team1: t.String({ description: 'Team 1 name' }),
      team2: t.String({ description: 'Team 2 name' }),
      id1: t.Number({ description: 'Team 1 id' }),
      id2: t.Number({ description: 'Team 2 id' }),
      competition: t.String({ description: 'Competition name' }),
      datatime: t.String({ description: 'Datetime of the match' }),
      isMatchLive: t.Boolean({ description: 'Is live' }),
      betLine: t.Array(t.Object({
        id: t.Number({ description: 'Bet line id' }),
        name: t.String({ description: 'Bet line name' }),
      }))

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