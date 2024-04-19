import { Elysia, t } from 'elysia';

const predictionRouter = new Elysia();

predictionRouter.get('/prediction', async (req) => {

  return new Response(JSON.stringify({
    message: 'Hello, today i not get you prediction. But try later, when i will be ready',
    role: 'assistant',
    history: []
  }), {
    status: 200
  });
}, {
  beforeHandle: (req) => {
    if (req.headers['x-api-key'] !== process.env.API_KEY) {
      throw new Error('Invalid API key');
    }
  },
  query: t.Object({
    teamId1: t.Numeric({
      description: 'Team id 1'
    }),
    teamId2: t.Optional(t.Numeric({
      description: 'Team id 2'
    }), true),
  }),
  response: {
    200: t.Object({
      message: t.String({
        description: 'The message of chatbot response'
      }),
      role: t.String({
        description: 'The role of chatbot response. Default: assistant'
      }),
      history: t.Array(t.Object({
        message: t.String({ description: 'The message sent to the chatbot' }),
        role: t.String({ description: "The role must be either 'user' or 'assistant'" })
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
  detail: {
    tags: ['Chatbot'],
    description: 'Return AI prediction based on selected teams.<br> If team id 2 is not provided, the prediction get upcoming match of team id 1'
  }
})


export default predictionRouter;