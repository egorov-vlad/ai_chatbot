import { Elysia } from 'elysia';
import MainService from '../../service/main.service';
const messageRouter = new Elysia();


messageRouter.post('/message', async (req) => {
  const service = new MainService();

  return new Response(JSON.stringify(
    {
      name: 'winline_ai_chatbot',
      success: true,
      message: 'Hello World'
    }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
})




export default messageRouter;