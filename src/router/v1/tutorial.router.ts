import { Elysia, t } from 'elysia';

const tutorialRouter = new Elysia();

tutorialRouter.get('/tutorial', async (req) => {

  return new Response(JSON.stringify({}), {
    status: 200
  })
}, {
  detail: {
    tags: ['Chatbot'],
    description: 'Return list of tutorials actions'
  },
  response: {
    200: t.Object({
      main: t.Array(t.Object({
        oddInfo: t.Array(t.Object({
          title: t.String(),
          description: t.String(),
        })),
        oddType: t.Array(t.Object({
          title: t.String(),
          description: t.String(),
        })),
        resGambling: t.Object({
          title: t.String(),
          description: t.String(),
        })
      })),
      projectInfo: t.Array(t.Object({
        title: t.String(),
        description: t.String()
      }))
    }, {
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
  beforeHandle: (req) => {
    if (req.headers['x-api-key'] !== process.env.API_KEY) {
      throw new Error('Invalid API key');
    }
  },
})

export default tutorialRouter