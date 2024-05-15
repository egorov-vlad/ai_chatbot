import { deleteAssistant, getAssistant, type TChatMessageHistory } from '../module/openAIClient';
import redisClient from '../module/redisClient';
import type { TPredictionResponse } from '../utils/types';
import { CachedService } from './cached.service';
import ChatService from './chat.service';

export class MainService {
  protected cached: CachedService;
  protected predictorAssistant: string = "";
  protected supportAssistant: string = "";
  protected chat: ChatService;

  constructor() {
    this.cached = new CachedService();
    this.chat = new ChatService();
    this.init();
  }

  async init() {
    this.predictorAssistant = await redisClient.get('predictorAssistant') as string;
    this.supportAssistant = await redisClient.get('supportAssistant') as string;
  }

  public async getMatchData(id: number): Promise<Response> {
    const match = this.cached.getMatchData('match', id);

    if (!match) {
      return new Response('Failed get match data', { status: 500 });
    }

    return this.createResponse(match, 200);
  }

  public async getTeams(): Promise<Response> {
    const teams = await this.cached.getWinlineTeams();

    if (!teams) {
      return new Response('Failed get teams', { status: 500 });
    }

    const format = {
      type: "button",
      title: "Сделать прогноз на name",
      message: "",
      isInputEnabled: false,
      next: ["chooseBetLine", "makeBet"],
      options: {
        url: "url"
      }
    };

    return this.createResponse({ teams, format }, 200);
  }

  public async getMatches(teamId?: number, matchTime: 'today' | 'tomorrow' = 'today'): Promise<Response> {
    const matches = await this.cached.getWinlineMatchesByTeamIdAndTime(teamId, matchTime);

    if (!matches) {
      return new Response('No matches in winline', { status: 404 });
    }

    const format = {
      type: "button",
      title: "Матч: team1 vs team2",
      message: "",
      isInputEnabled: false,
      next: ["chooseBetLine", "makeBet"],
      options: {
        url: "url"
      },
    }

    return this.createResponse({ matches, format }, 200);
  }

  public async getPrediction(teamId: number, matchId: number, betLineId: number): Promise<Response> {
    let match: TPredictionResponse | null = null;

    if (matchId) {
      match = await this.cached.getPredictionByMatchId(matchId, betLineId);
    }

    if (teamId) {
      match = await this.cached.getPredictionByTeamId(teamId, betLineId);
    }

    if (!match) {
      return new Response('Failed get prediction', { status: 500 });
    }

    return this.createResponse(match, 200);
  }

  public async sendMessage(message: string, threadId?: string): Promise<Response> {
    if (!this.supportAssistant || !this.predictorAssistant) {
      await this.init();
    }

    const textAnalyserRes = await this.chat.textAnalyser(message, this.supportAssistant);

    if (!textAnalyserRes) {
      return new Response('Failed get AI response', { status: 500 });
    }

    const res = await this.chat.validateMessage(message, textAnalyserRes, this.predictorAssistant, threadId);
    if (!res) {
      return new Response('Failed get AI response', { status: 500 });
    }

    return this.createResponse(res, 200);
  }

  public async test() {
    // await deleteAssistant("asst_OR4UrznjfTgIxIFg5QtjPSuw");
    // await deleteAssistant("asst_mJCib449G33ihFVP7KkgRTIy");
    return getAssistant();
  }

  private createResponse(res: any, status: number) {
    return new Response(JSON.stringify(res), { status: status });
  }
}