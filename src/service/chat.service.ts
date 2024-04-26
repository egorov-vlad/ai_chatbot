import { sendMessageToGPT, type TChatMessageHistory } from '../module/openAIClient';
// import redisClient from '../module/redisClient';
// import PredictionService from './pediction.service';

export default class ChatService {
  // protected userData: any;
  // protected prediction: PredictionService;

  constructor() {
    // this.userData = userData;
    // this.prediction = new PredictionService();
  }

  async sendMessage(message: string, history: TChatMessageHistory) {
    message = message.trim();

    //TODO: Add prompt

    const gptRequest = await sendMessageToGPT(message, history);

    //TODO: Deserialize gptRequest to json
    // if (!gptRequest) return null;

    //   return {
    //     botMessage: 'Chatbot response',
    //     history: history,
    //     options: {
    //       closeSession: false
    //     }
    //   }
    // }
  }
}