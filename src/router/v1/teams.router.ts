import { Elysia, t } from 'elysia';
import { CachedService } from '../../service/cached.service';
import { betLines } from '../../utils/constants';

const teamsRouter = new Elysia();

teamsRouter.get('/teams', async (req) => {
  const service = new CachedService();
  const teams = await service.getWinlineTeams();
  const format = {
    type: "button",
    title: "Сделать прогноз на name",
    message: "",
    isInputEnabled: false,
    next: ["chooseBetLine", "makeBet"],
    options: {
      url: "url"
    }
  } 
  // betLines: betLines
  return new Response(JSON.stringify({ teams: teams, format: format }), {
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
        name: t.String(),
        url: t.String()
      }, {
        description: 'Return list of teams who play today'
      }), {
        description: 'OK'
      }),
      // betLines: t.Array(t.Object({
      //   id: t.Number({ description: 'Bet line id' }),
      //   name: t.String({ description: 'Bet line name' }),
      // })),
      format: t.Object({
        type: t.String({ description: 'The type of the button. Can be "text" or "button"' }),
        title: t.String({ description: 'The text of the button' }),
        message: t.String({ description: 'The static phrase of the bot, which should be reflected by clicking on the button. If string is empty, the message dont will be shown' }),
        isInputEnabled: t.Boolean({ description: 'Is the input enabled after clicking on the button' }),
        next: t.Array(t.String({ description: 'The name of the next button' })),
        options: t.Optional(t.Object({
          url: t.String({ description: 'Url to opn after clicking on the button. In parameters: teams.url' })
        }))
      }, { description: 'The format for generate buttons' }),
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