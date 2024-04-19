import { Elysia, t } from 'elysia';
import ChatService from '../../service/chat.service';
import makeResponse from '../../utils/makeResponse';


const messageRouter = new Elysia();

messageRouter.post('/message', async (req) => {
  // const mainService = new ChatService(req);
  const data = await ChatService.sendMessage(req.body.message, req.body.history);

  console.log(req.body.message);
  // const data = await mainService.getData();

  return new Response(JSON.stringify(data), {
    status: 200
  })
}, {
  body: t.Object({
    message: t.String({
      maxLength: 300,
      description: 'The message to be sent to the chatbot'
    }),
    history: t.Array(t.Object({
      message: t.String({ description: 'The message sent to the chatbot' }),
      role: t.Enum(
        {
          user: 'user',
          assistant: 'assistant'
        },
        { description: "The role must be either 'user' or 'assistant'" })
    }), {
      default: [],
      description: 'The history of messages sent to the chatbot'
    }),
  }),
  response: {
    200: t.Object({
      message: t.String({ description: 'The response from the chatbot' }),
      role: t.String({ description: 'The role of the response. Default: assistant' }),
      history: t.Array(t.Object({
        message: t.String({ description: 'The message sent to the chatbot' }),
        role: t.String({ description: "The role must be either 'user' or 'assistant'" })
      })),
      options: t.Optional(t.Object({}, { description: 'Optional parameters' }), true),
    }, {
      description: 'OK'
    }),
    400: t.Object({

    }, {
      description: 'Bad Request',
    }),
    500: t.Object({
      message: t.String(),
      name: t.String()
    }, {
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