
import logger from '../module/logger';
import { createRun, createThread, getMessageList, pullMessages, sendMessageToThread, type TChatMessageHistory } from '../module/openAIClient';
import type { TChatWithTreadIDResponse, TMatchData } from '../utils/types';


export default class PredictionService {

  public async getPrediction(matchData: TMatchData, assistantId: string, question: string): Promise<TChatWithTreadIDResponse | null> {
    const threadId = await createThread();

    if (!threadId) {
      logger.error("Thread creation failed " + JSON.stringify(matchData));
      return null;
    }

    await sendMessageToThread(threadId, `${question}` + JSON.stringify(matchData));
    const runId = await createRun(threadId, assistantId);

    if (!runId) {
      logger.error("Run creation failed " + JSON.stringify(matchData));
      return null;
    }
    const res = await this.checkStatus(threadId, runId);

    logger.info("Prediction done for: " + performance.now())

    return res ? {
      ...res,
      threadId
    } : null;
  }


  public async getPredictionByThread(message: string, threadId: string, assistantId: string): Promise<TChatWithTreadIDResponse | null> {

    await sendMessageToThread(threadId, message);
    const runId = await createRun(threadId, assistantId);

    if (!runId) {
      logger.error("Run creation failed " + threadId + message);
      return null;
    }

    const res = await this.checkStatus(threadId, runId);

    return res ? {
      ...res,
      threadId
    } : null;
  }

  private async checkStatus(threadId: string, runId: string) {
    let messages = await pullMessages(threadId, runId);

    if (!messages) {
      logger.error("Failed pull messages " + threadId + " " + runId);
      return null;
    }

    while (messages.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      messages = await pullMessages(threadId, runId);
      if (!messages || messages.status === "failed") {
        logger.error("AI thread failed " + messages + " " + threadId + " " + runId);
        return null;
      }
    }

    const res = await getMessageList(threadId);
    if (!res) {
      logger.error("Failed get AI response " + threadId + " " + runId);
      return null;
    }

    return res;
  }
}

