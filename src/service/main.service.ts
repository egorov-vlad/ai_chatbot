import { deleteAssistant, getAssistant, type TChatMessageHistory } from '../module/openAIClient';
import redisClient from '../module/redisClient';
import { CachedService } from './cached.service';
import ChatService from './chat.service';

export class MainService {
  protected cached: CachedService;
  protected predictorAssistant: string = "";
  protected supportAssistant: string = "";

  constructor() {
    this.cached = new CachedService();

    this.init();
  }

  async init() {
    this.predictorAssistant = await redisClient.get('predictorAssistant') as string;
    this.supportAssistant = await redisClient.get('supportAssistant') as string;
  }

  public async getMatchData(id: number) {
    return this.cached.getMatchData('match', id);
  }

  public async getTeams() {
    return this.cached.getWinlineTeams();
  }

  public async getMatches(teamId?: number, matchTime: 'today' | 'tomorrow' = 'today') {
    return this.cached.getWinlineMatchesByTeamIdAndTime(teamId, matchTime);
  }

  public async getPrediction(teamId: number, matchId: number, betLineId: number, threadId: string) {
    //prediction by matchId
    //prediction by matchId and betLineId
    if (matchId) {
      return this.cached.getPredictionByMatchId(matchId, betLineId);
    }

    //prediction by teamId
    //prediction by teamId and betLineId
    if (teamId) {
      return this.cached.getPredictionByTeamId(teamId, betLineId);
    }
  }

  public async sendMessage(message: string, history: TChatMessageHistory, threadId?: string) {
    if (!this.supportAssistant || !this.predictorAssistant) {
      await this.init();
    }

    const chat = new ChatService();

    const textAnalyserRes = await chat.textAnalyser(message, this.supportAssistant);

    const res = await chat.validateMessage(message, textAnalyserRes, this.predictorAssistant, threadId);

    return { ...res, threadId };
  }

  public async test() {
    // await deleteAssistant("asst_lUJexpIWWQ7Fo3KW0W4kLE4I");
    return getAssistant();
  }
}