import logger from '../module/logger';
import { deleteAssistant, getAssistant } from '../module/openAIClient';
import redisClient from '../module/redisClient';
import type { TPredictionResponse } from '../utils/types';
import { CachedService } from './cached.service';
import ChatService from './chat.service';
import StratzService from './stratz.service';

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

  public async getMatchData(id: number, line?: number): Promise<Response> {
    const match = await this.cached.getMatchData('match', id, line);

    if (!match) {
      return new Response('Failed get match data', { status: 500 });
    }

    return this.createResponse(match, 200);
  }

  public async getTeams(): Promise<Response> {
    const teams = await this.cached.getWinlineTeams();

    if (!teams || teams.length === 0) {
      logger.error('Failed get teams or teams is empty');
      return new Response('Failed get teams or teams is empty', { status: 404 });
    }

    const format = {
      type: "button",
      title: "Рекомендация на name",
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

    if (!matches || matches.length === 0) {
      logger.error('Failed get matches or matches is empty');
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

  public async getPrediction(teamId: number, matchId: number, betLineId: number, threadId?: string): Promise<Response> {
    let match: TPredictionResponse | null = null;

    if (matchId) {
      match = await this.cached.getPredictionByMatchId(matchId, betLineId, threadId);
    }

    if (teamId) {
      match = await this.cached.getPredictionByTeamId(teamId, betLineId, threadId);
    }

    if (!match) {
      logger.error('Failed get prediction ' + ' ' + teamId + ' ' + matchId + ' ' + betLineId);
      return new Response('Failed get prediction', { status: 500 });
    }

    const messageFormatted = match.message as string;
    match.message = this.formateMessage(messageFormatted);;

    return this.createResponse(match, 200);
  }

  public async sendMessage(message: string, threadId: string): Promise<Response> {
    if (!this.supportAssistant || !this.predictorAssistant) {
      await this.init();
    }

    const threadData = await redisClient.get(`threadData:${threadId}`) as string;
    const textAnalyserRes = await this.chat.textAnalyser(message + ' ' + threadData, this.supportAssistant);

    if (!textAnalyserRes) {
      logger.error('Failed get AI text analyser response ' + ' ' + message + ' ' + threadId);
      return new Response('Failed get AI response', { status: 500 });
    }

    let res = await this.chat.validateMessage(message, textAnalyserRes, this.predictorAssistant, threadId);
    if (!res) {
      logger.error('Failed get AI response ' + ' ' + message + ' ' + threadId + JSON.stringify(textAnalyserRes));
      return new Response('Failed get AI response', { status: 500 });
    }

    const messageFormatted = res.message as string;
    res.message = this.formateMessage(messageFormatted);

    return this.createResponse(res, 200);
  }

  public async shortPrediction(matchId: number): Promise<Response> {
    const shortPrediction = await this.cached.getShortPrediction(matchId);

    if (!shortPrediction) {
      logger.error('Failed get short prediction ' + ' ' + matchId);
      return new Response('Failed get short prediction', { status: 500 });
    }

    return this.createResponse(shortPrediction, 200);
  }

  public async test() {
    // await deleteAssistant("asst_GZUnhe1K4qMbHuCPiAiDk1kI");
    // await deleteAssistant("asst_ntO5bvAzWHN2asuGDj4Cx1pr");
    // return getAssistant();
  }

  private formateMessage(message: string) {
    return message.replace(/\n/g, '<br>').replace(/\*\*/g, '');
  }

  private createResponse(res: any, status: number) {
    return new Response(JSON.stringify(res), { status: status });
  }
}