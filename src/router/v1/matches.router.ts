import { Elysia, t } from 'elysia';

const matchesRouter = new Elysia();

//return list of matches
//If teamId is set, return list of matches for this team
//If matchTime is set, return list of matches for this time
//@ts-ignore
matchesRouter.get('/matches', async ({ query, main }) => {
  const res = await main()?.getMatches(query.teamId, query.matchTime);

  return res
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
      matches: t.Array(t.Object({
        id: t.String({ description: 'Match id' }),
        EventUrl: t.String({ description: 'Event url' }),
        team1: t.String({ description: 'Team 1 name' }),
        team2: t.String({ description: 'Team 2 name' }),
        id1: t.Number({ description: 'Team 1 id' }),
        id2: t.Number({ description: 'Team 2 id' }),
        competition: t.String({ description: 'Competition name' }),
        datatime: t.String({ description: 'Datetime of the match' }),
        isMatchLive: t.Boolean({ description: 'Is live' }),
        odds: t.Object({
          line: t.Array(t.Object({
            freeText: t.String({ description: 'Line name' }),
            name1: t.String({ description: 'Team 1 name' }),
            odd1: t.String({ description: 'Team 1 odd' }),
            name2: t.String({ description: 'Team 2 name' }),
            odd2: t.String({ description: 'Team 2 odd' }),
          }))
        }, { description: "Winline odds. If line closed odds will be empty string" })
      })),
      format: t.Object({
        type: t.String({ description: 'The type of the button. Can be "text" or "button"' }),
        title: t.String({ description: 'The text of the button' }),
        message: t.String({ description: 'The static phrase of the bot, which should be reflected by clicking on the button. If string is empty, the message dont will be shown' }),
        isInputEnabled: t.Boolean({ description: 'Is the input enabled after clicking on the button' }),
        next: t.Array(t.String({ description: 'The name of the next button' })),
        options: t.Optional(t.Object({
          url: t.String({ description: 'Url to opn after clicking on the button' })
        }))
      })
    }, {
      description: 'OK',
    }),
    400: t.String({ description: 'Bad Request' }),
    500: t.String({ description: 'Internal Server Error' })
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