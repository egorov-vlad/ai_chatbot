import { createRun, createThread, getMessageList, pullMessages, sendMessageToGPT, sendMessageToThread, type TChatMessageHistory } from '../module/openAIClient';
// import redisClient from '../module/redisClient';
import PredictionService from './pediction.service';

export default class ChatService {
  // protected userData: any;
  protected prediction: PredictionService;

  constructor() {
    // this.userData = userData;
    this.prediction = new PredictionService();
  }

  async sendMessage(message: string, history: TChatMessageHistory) {
    message = message.trim();

    //TODO: Add prompt

    const gptRequest = await sendMessageToGPT(message, history);

    if (!gptRequest) return null;

    // return gptRequest;

    //TODO: Deserialize gptRequest to json
    // if (!gptRequest) return null;

    // return {
    //   message: gptRequest[0].message.content,
    //   role: gptRequest[0].message.role,
    //   history: history,
    // }
  }
  public async textAnalyser(message: string, assistantId: string) {

    const threadId = await createThread();
    const threadMessage = await sendMessageToThread(threadId, message);
    const runId = await createRun(threadId, assistantId);

    const res = await this.checkStatus(threadId, runId);

    return res;
  }
  private async checkStatus(threadId: string, runId: string) {
    let messages = await pullMessages(threadId, runId);

    while (messages.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      messages = await pullMessages(threadId, runId);
    }
    const res = await getMessageList(threadId);

    return res;
  }

  public async validateMessage(message: string, textAnalyserRes: any, assistantId: string, threadId?: string,) {
    console.log(textAnalyserRes.message, threadId);
    if ((textAnalyserRes.message === "relevant" || textAnalyserRes.message === "wetrain") && threadId) {
      const predictor = new PredictionService();

      const res = await predictor.getPredictionByThread(message, threadId, assistantId);

      return res;
    } else {
      if (textAnalyserRes.message === "irrelevant") {
        return { massage: "Извините, я располагаю информацией только о текущем турнире.", role: "assistant" };
      }

      if (textAnalyserRes.message === "nsfw") {
        return { message: "Ваш запрос не может быть выполнен в соответствии с правилами использования нашего сервиса.", role: "assistant" };
      }

      if (textAnalyserRes.message === "archive") {
        return { message: "Извините, я располагаю информацией только о текущем турнире", role: "assistant",options:{
          next: ["howToBet", "startPrediction"]
        } };
      }

      return { massage: "Я не могу ответить на этот вопрос", role: "assistant" };
    }
  }
}

