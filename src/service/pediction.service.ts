
import { createRun, createThread, getMessageList, pullMessages, sendMessageToThread } from '../module/openAIClient';
import { betLines } from '../utils/constants';
import type { TMatchData } from '../utils/types';
import { PandascoreService } from './pandascore.service';


export default class PredictionService {
  protected pandascore: PandascoreService;

  constructor() {
    this.pandascore = new PandascoreService();
  }

  public async getWinPrediction(matchData: TMatchData, assistantId: string = "asst_sd7RiXTvptxDajv5i0P5d1hS") {
    console.time("CreateThread");
    const threadId = await createThread();
    const threadMessage = await sendMessageToThread(threadId, "Кто победит? " + JSON.stringify(matchData));
    const runId = await createRun(threadId, assistantId);
    console.timeEnd("CreateThread");

    console.time("checkStatus");
    const res = await this.checkStatus(threadId, runId);
    console.timeEnd("checkStatus");

    return res;
  }

  public async getPredictionByBetLine(matchData: TMatchData, assistantId: string = "asst_sd7RiXTvptxDajv5i0P5d1hS", question: string) {

    const threadId = await createThread();
    const threadMessage = await sendMessageToThread(threadId, `${question}` + JSON.stringify(matchData));
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

