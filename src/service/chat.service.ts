import { createRun, createThread, getMessageList, pullMessages, sendMessageToThread, type TChatMessageHistory } from '../module/openAIClient';
import PredictionService from './pediction.service';

export default class ChatService {
  protected prediction: PredictionService;

  constructor() {
    this.prediction = new PredictionService();
  }

  public async textAnalyser(message: string, assistantId: string) {

    const threadId = await createThread();
    if(!threadId) return null
    const threadMessage = await sendMessageToThread(threadId, message);

    const runId = await createRun(threadId, assistantId);
    if(!runId) return null;

    const res = await this.checkStatus(threadId, runId);

    return res;
  }
  private async checkStatus(threadId: string, runId: string) {
    let messages = await pullMessages(threadId, runId);
    

    while (messages?.status !== "completed") {
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
      case "relevant":
      case"wetrain":
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

