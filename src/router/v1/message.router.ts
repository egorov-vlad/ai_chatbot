import { Elysia, t } from 'elysia';
import ChatService from '../../service/chat.service';

const messageRouter = new Elysia();

//@ts-ignore
messageRouter.post('/message', async ({ body, main }) => {

  const res = await main().sendMessage(body.message, [], body.threadId);

  return new Response(JSON.stringify(res), {
    status: 200
  })

  // if (!res) {
  //   return new Response(JSON.stringify({
  //     message: 'Error occurred while sending message to the chatbot. Please try again later',
  //     name: 'Internal Server Error'
  //   }), {
  //     status: 500
  //   })
  // }

  // console.log(req.body.message);
  // // const data = await mainService.getData();

  // return new Response(JSON.stringify(res), {
  //   status: 200
  // })
}, {
  body: t.Object({
    message: t.String({
      maxLength: 300,
      description: 'The message to be sent to the chatbot'
    }),
    threadId: t.String({ description: 'The id of the thread' }),
    // history: t.Array(t.Object({
    //   content: t.String({ description: 'The message sent to the chatbot' }),
    //   role: t.Enum(
    //     {
    //       user: 'user',
    //       assistant: 'assistant',
    //       system: 'system'
    //     },
    //     { description: "The role must be either 'user', 'assistant', 'system'" })
    // }), {
    //   default: [],
    //   description: 'The history of messages sent to the chatbot'
    // }),
  }),
  response: {
    200: t.Object({
      message: t.String({ description: 'The response from the chatbot' }),
      role: t.String({ description: 'The role of the response. Default: assistant' }),
      // threadId: t.Optional(t.String({ description: 'The id of the thread' }), true),
      // history: t.Array(t.Object({
      //   message: t.String({ description: 'The message sent to the chatbot' }),
      //   role: t.String({ description: "The role must be either 'user', 'assistant', 'system'" })
      // })),
      options: t.Optional(t.Object({
        next: t.Array(t.String({ description: 'The next command to will be show to the user' }))
      }, { description: 'Optional parameters' }), true),
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