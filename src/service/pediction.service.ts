
import { createRun, createThread, getMessageList, pullMessages, sendMessageToThread, type TChatMessageHistory } from '../module/openAIClient';
import { betLines } from '../utils/constants';
import type { TMatchData } from '../utils/types';
import { PandascoreService } from './pandascore.service';


export default class PredictionService {
  protected pandascore: PandascoreService;

  constructor() {
    this.pandascore = new PandascoreService();
  }

  public async getWinPrediction(matchData: TMatchData, assistantId: string) {
    console.time("CreateThread");
    const threadId = await createThread();
    const threadMessage = await sendMessageToThread(threadId, "Кто победит? " + JSON.stringify(matchData));
    const runId = await createRun(threadId, assistantId);
    console.timeEnd("CreateThread");

    console.time("checkStatus");
    const res = await this.checkStatus(threadId, runId);
    console.timeEnd("checkStatus");

    return {
      ...res,
      threadId
    };
  }

  public async getPredictionByBetLine(matchData: TMatchData, assistantId: string, question: string) {

    const threadId = await createThread();
    const threadMessage = await sendMessageToThread(threadId, `${question}` + JSON.stringify(matchData));
    const runId = await createRun(threadId, assistantId);

    const res = await this.checkStatus(threadId, runId);

    return res;
  }

  public async getPredictionByThread(message: string, threadId: string, assistantId: string) {

    const threadMessage = await sendMessageToThread(threadId, message);
    const runId = await createRun(threadId, assistantId);

    const res = await this.checkStatus(threadId, runId);

    return res;
  }

  private async checkStatus(threadId: string, runId: string) {
    let messages = await pullMessages(threadId, runId);

    console.time("awaitComplete")
    while (messages.status !== "completed") {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      messages = await pullMessages(threadId, runId);
    }

    console.timeEnd("awaitComplete")
    console.time("getMessageList");
    const res = await getMessageList(threadId);
    console.timeEnd("getMessageList");
    return res;
  }
}

