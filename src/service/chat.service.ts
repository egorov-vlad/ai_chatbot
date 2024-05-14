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

  public async validateMessage(message: string, textAnalyserRes: any, assistantId: string, threadId?: string) {
    console.log(message, textAnalyserRes.message, threadId);

    if (!threadId) return null

    switch (textAnalyserRes.message) {
      case "relevant" || "wetrain":
        const predictor = new PredictionService();

        const res = await predictor.getPredictionByThread(message, threadId, assistantId);

        return {
          ...res,
          options: {
            isRelevant: true
          }
        };
      case "irrelevant":
        return {
          massage: "Извините, я располагаю информацией только о текущем турнире.",
          role: "assistant",
          options: {
            isRelevant: false,
            next: ["howToBet", "startPrediction"]
          }
        };
      case "nsfw":
        return {
          message: "Ваш запрос не может быть выполнен в соответствии с правилами использования нашего сервиса",
          role: "assistant",
          options: {
            isRelevant: false,
            next: ["toStart"]
          }
        };
      case "archive":
        return {
          message: "Извините, я располагаю информацией только о текущем турнире",
          role: "assistant",
          options: {
            isRelevant: false,
            next: ["toStart"]
          }
        };
      case "help":
        return {
          message: 'Если тебе нужна информация о разных видах ставок и пари или о том, как делать ставки, я могу перевести тебя в нашу обучающую рубрику. Там ты найдешь все, что тебе нужно. Просто нажми на кнопку "Как сделать ставку?" под нашим диалогом',
          role: "assistant",
          options: {
            isRelevant: true,
            next: ["howToBet"]
          }
        };
      case "bettoday":
        return {
          message: "Сегодня состоятся эти матчи. На какой из них ты хочешь получить прогноз?",
          role: "assistant",
          options: {
            isRelevant: true,
            next: ["todayBet"]
          }
        }
      case "bettomorrow":
        return {
          message: "Я могу предложить прогнозы на матчи, которые состоятся завтра. Какой матч интересует?",
          role: "assistant",
          options: {
            isRelevant: true,
            next: ["tomorrowBet"]
          }
        }
      default:
        return {
          massage: "Я не могу ответить на этот вопрос",
          role: "assistant",
          options: {
            isRelevant: false,
            next: ["toStart"]
          }
        };
    }
  }
}

