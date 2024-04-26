import { Elysia, t } from 'elysia';
import { staticInfo } from '../../utils/constants';

const staticRouter = new Elysia();

staticRouter.get('/static', async (req) => {

  return new Response(JSON.stringify(staticInfo), {
    status: 200
  })
}, {
  detail: {
    tags: ['Chatbot'],
    description: 'Return list of static chatbot text and buttons'
  },
  response: {
    200: t.Array(t.Object({
      name: t.String({ description: "Unique filed name" }),
      message: t.String({ description: "The static phrase of the bot, which should be reflected by clicking on the button" }),
      type: t.String({ description: "The type of the button. Can be 'text' or 'button'" }),
      title: t.String({ description: "The title of the button" }),
      isInputEnabled: t.Boolean({ description: "Is the input enabled after clicking on the button" }),
      next: t.Array(t.String({ description: "The name of the next button" })),
      options: t.Optional(t.Object({
        url: t.String({ description: "Url to opn after clicking on the button" })
      }))
    }), {
      description: 'OK'
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
})

export default staticRouter