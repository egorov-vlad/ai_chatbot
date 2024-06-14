import { Elysia, t } from 'elysia';
import logger from '../../module/logger';

const messageRouter = new Elysia();

//@ts-ignore
messageRouter.post('/message', async ({ body, main, cookie: { StickySession } }) => {
  logger.info(`StickySession: ${StickySession}`);
  const res = await main().sendMessage(body.message, body.threadId);

  return res
}, {
  body: t.Object({
    message: t.String({
      maxLength: 300,
      description: 'The message to be sent to the chatbot'
    }),
    threadId: t.String({ description: 'The id of the thread' }),
  }),
  response: {
    200: t.Object({
      message: t.String({ description: 'The response from the chatbot' }),
      role: t.String({ description: 'The role of the response. Default: assistant' }),
      options: t.Optional(t.Object({
        isRelevant: t.Boolean({ description: 'Whether the response is relevant to the user' }),
        next: t.Array(t.String({ description: 'The next command to will be show to the user' }))
      }, { description: 'Optional parameters' }), true),
    }, {
      description: 'OK'
    }),
    400: t.String({
      description: 'Bad Request',
    }),
    500: t.String({
      description: 'Internal Server Error'
    })
  },
  beforeHandle: (req) => {
    if (req.headers['x-api-key'] !== process.env.API_KEY) {
      throw new Error('Invalid API key');
    }
  },
  detail: {
    tags: ['Chatbot'],
    description: 'Send a message to the chatbot'
  }
})



export default messageRouter;