import { Elysia, t } from 'elysia';
import ChatService from '../../service/chat.service';
import makeResponse from '../../utils/makeResponse';


const messageRouter = new Elysia();

//TODO: add validation for request 
messageRouter.post('/message', async (req) => {
  const mainService = new ChatService(req);
  const data = await mainService.getData();

  return makeResponse({ status: 200, body: { data: data, success: true } });
})



export default messageRouter;