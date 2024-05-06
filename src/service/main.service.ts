import { getAssistant, type TChatMessageHistory } from '../module/openAIClient';
import { CachedService } from './cached.service';
import ChatService from './chat.service';

export class MainService {
  protected cached: CachedService;

  constructor() {
    this.cached = new CachedService();
  }

  public async getTeams() {
    return this.cached.getWinlineTeams();
  }

  public async getMatches(teamId?: number, matchTime: 'today' | 'tomorrow' = 'today') {
    return this.cached.getWinlineMatchesByTeamIdAndTime(teamId, matchTime);
  }

  public async getPrediction(teamId: number, matchId: number, betLineId: number) {
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

  public async sendMessage(message: string, history: TChatMessageHistory) {
    const chat = new ChatService();
    const textAnalyserRes = await chat.textAnalyser(message, "asst_lUJexpIWWQ7Fo3KW0W4kLE4I");

    const res = await chat.validateMessage(message, textAnalyserRes, history);

    return res;
  }

  public async test() {
    return getAssistant();

  }
}