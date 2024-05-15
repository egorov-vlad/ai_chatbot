import logger from '../module/logger';
import { createRun, createThread, getMessageList, pullMessages, sendMessageToThread, type TChatMessageHistory } from '../module/openAIClient';
import type { TChatResponse, TMessageResponse } from '../utils/types';
import PredictionService from './pediction.service';

export default class ChatService {
  protected prediction: PredictionService;

  constructor() {
    this.prediction = new PredictionService();
  }

  public async textAnalyser(message: string, assistantId: string): Promise<TChatResponse | null> {
    const threadId = await createThread();

    if (!threadId) {
      logger.error("Thread creation failed " + message + " " + assistantId);
      return null;
    }

    await sendMessageToThread(threadId, message);
    const runId = await createRun(threadId, assistantId);

    if (!runId) {
      logger.error("Run creation failed " + message + " " + assistantId);
      return null;
    }

    const res = await this.checkStatus(threadId, runId);

    if (!res) {
      logger.error("Failed checkStatus " + message + " " + assistantId);
      return null;
    }

    return res;
  }

  private async checkStatus(threadId: string, runId: string): Promise<TChatResponse | null> {
    let messages = await pullMessages(threadId, runId);
    if (!messages) {
      logger.error("Failed pull messages " + threadId + " " + runId);
      return null;
    }

    while (messages.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      messages = await pullMessages(threadId, runId);

      if (!messages) {
        logger.error("Failed pull messages " + threadId + " " + runId);
        return null;
      }
    }

    const res = await getMessageList(threadId);
    if (!res) {
      logger.error("Failed getMessageList " + threadId + " " + runId);
      return null;
    }

    return res;
  }

  public async validateMessage(message: string, textAnalyserRes: any, assistantId: string, threadId?: string): Promise<TMessageResponse | null> {
    logger.info(threadId + " " + textAnalyserRes.message + " " + message);

    if (!threadId) {
      logger.error("Thread not found ", message, textAnalyserRes.message, assistantId);
      return null;
    }

    switch (textAnalyserRes.message) {
      case "relevant":
      case "support":
      case "wetrain":
        const predictor = new PredictionService();
        const res = await predictor.getPredictionByThread(message, threadId, assistantId);
        if (!res) {
          logger.error("Failed getPredictionByThread ", message, textAnalyserRes.message, assistantId);
          return null;
        }
        return {
          ...res,
          options: {
            isRelevant: true
          }
        };
      case "irrelevant":
        return {
          message: "Извините, я располагаю информацией только о текущем турнире.",
          role: "assistant",
          threadId: threadId,
          options: {
            isRelevant: false,
            next: ["howToBet", "startPrediction"]
          }
        };
      case "nsfw":
        return {
          message: "Ваш запрос не может быть выполнен в соответствии с правилами использования нашего сервиса",
          role: "assistant",
          threadId: threadId,
          options: {
            isRelevant: false,
            next: ["toStart"]
          }
        };
      case "archive":
        return {
          message: "Извините, я располагаю информацией только о текущем турнире",
          role: "assistant",
          threadId: threadId,
          options: {
            isRelevant: false,
            next: ["toStart"]
          }
        };
      case "help":
        return {
          message: 'Если тебе нужна информация о разных видах ставок и пари или о том, как делать ставки, я могу перевести тебя в нашу обучающую рубрику. Там ты найдешь все, что тебе нужно. Просто нажми на кнопку "Как сделать ставку?" под нашим диалогом',
          role: "assistant",
          threadId: threadId,
          options: {
            isRelevant: true,
            next: ["howToBet"]
          }
        };
      case "bettoday":
        return {
          message: "Сегодня состоятся эти матчи. На какой из них ты хочешь получить прогноз?",
          role: "assistant",
          threadId: threadId,
          options: {
            isRelevant: true,
            next: ["todayBet"]
          }
        };
      case "bettomorrow":
        return {
          message: "Я могу предложить прогнозы на матчи, которые состоятся завтра. Какой матч интересует?",
          role: "assistant",
          threadId: threadId,
          options: {
            isRelevant: true,
            next: ["tomorrowBet"]
          }
        };
      default:
        return {
          message: "Я не могу ответить на этот вопрос",
          role: "assistant",
          threadId: threadId,
          options: {
            isRelevant: false,
            next: ["toStart"]
          }
        };
    }
  }
}

