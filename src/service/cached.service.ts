import redisClient from '../module/redisClient';
import type { MatchList, TMatch, TSupportTables, TWinlineEvent, TWinlineTeams } from '../utils/types';
import PredictionService from './pediction.service';
import StratzService from './stratz.service';
import TeamService from './team.service';
import { WinlineMatchService } from './winlineMatches.service';

export class CachedService {
  protected redisClient: any;
  protected winlineMatches: WinlineMatchService;
  protected stratz: StratzService;
  protected teams: TeamService;

  constructor() {
    this.redisClient = redisClient;

    this.winlineMatches = new WinlineMatchService();
    this.stratz = new StratzService();
    this.teams = new TeamService();
  }

  private async getCachedData(key: string): Promise<Object | null> {
    const data = await redisClient.get(key) as string;

    if (data && data.length > 2) {
      return JSON.parse(data);
    }

    return null;
  }

  private async setCachedData(key: string, data: any, expireSec: number = 30) {
    await redisClient.set(key, JSON.stringify(data), { EX: expireSec });
  }

  public async getWinlineTeams(): Promise<TWinlineTeams[]> {
    const isTeams = await this.getCachedData('winlineTeams') as TWinlineTeams[];

    if (isTeams) {
      return isTeams;
    }

    const allMatches = await this.getAllMatches();

    const teams = new TeamService();
    const winlineTeams = teams.getTeams(allMatches);

    this.setCachedData('winlineTeams', winlineTeams, 60);

    return winlineTeams;

  }

  public async getAllMatches(): Promise<TMatch[] | []> {
    const isAllMatches = await this.getCachedData('winlineAllMatches') as TWinlineEvent[];

    if (isAllMatches) {
      return isAllMatches;
    }

    const winlineAllMatches = await this.winlineMatches.getAllMatches();

    if (winlineAllMatches.length === 0) return [];

    this.setCachedData('winlineAllMatches', winlineAllMatches);

    return winlineAllMatches;
  }

  public async getWinlineMatchesByTeamIdAndTime(teamId?: number, matchTime: 'today' | 'tomorrow' = 'today'): Promise<TMatch[] | []> {
    const isTeamMatches = await this.getCachedData(`winlineTeamMatches:${teamId}`) as TMatch[];
    const isTodayMatches = await this.getCachedData(`winlineTodayMatches`) as TMatch[];
    const isTomorrowMatches = await this.getCachedData(`winlineTomorrowMatches`) as TMatch[];


    if (isTeamMatches && teamId && matchTime === 'today') {
      return isTeamMatches;
    }

    if (isTodayMatches && matchTime === 'today') {
      return isTodayMatches;
    }

    if (isTomorrowMatches && matchTime === 'tomorrow') {
      return isTomorrowMatches;
    }


    const matches = await this.winlineMatches.getMatches(teamId, matchTime);

    if (Array.isArray(matches)) return [];

    if (matches.type === 'team') {
      this.setCachedData(`winlineTeamMatches:${teamId}`, matches.data);
      return matches.data;
    }

    if (matches.type === 'today') {
      this.setCachedData(`winlineTodayMatches`, matches.data);
      return matches.data;
    }

    if (matches.type === 'tomorrow') {
      this.setCachedData(`winlineTomorrowMatches`, matches.data);
      return matches.data;
    }

    return [];
  }


  public async getPredictionByTeamId(teamId: number, line: number) {
    const isPrediction = await this.getCachedData(`chatbotPrediction:${teamId}:${line}`);

    if (isPrediction) {
      return isPrediction;
    }

    const predictor = new PredictionService();

    const prediction = await predictor.getPredictionByTeamId({ teamId, line });

    this.setCachedData(`chatbotPrediction:${teamId}:${line}`, prediction, 30);

    return prediction;
  }

  /**
   * A description of the entire function.
   *
   * @param {number} winlineMatchId - The Winline ID of the match
   * @param {number} betLineId - The Winline ID of the bet
   * @return {void} 
   */
  public async getPredictionByMatchId(winlineMatchId: number, betLineId: number) {
    //Get real matchId by winlineMatchId
    const allMatches = await this.getAllMatches();
    const teams = this.teams.getTeamsByWinlineMatchId(winlineMatchId, allMatches);

    // if (!teams?.id1 && !teams?.id2) {
    //   console.error('No teams found');
    //   return null;
    // }
    const matchId = 7705557154;
    // const matchId = await this.getMatchIdByTeamId(teams.id1, teams.id2);
    // const supportTables = await this.getSupportTables();

    if (!matchId) {
      console.error('No matchId in stratz found');
      return null
    };

    //get stats by matchId
    const matchStat = await this.getStatisticsByMatchId(matchId);

    if (!matchStat) {
      console.error(`Stratz failed to get statistics for matchId: ${matchId}`);
      return null
    }

    return matchStat;

    // return supportTables;

    //get prediction

    //set cache

    //return
  }

  //Stratz
  public async getSupportTables(): Promise<TSupportTables | null> {
    const isSupportTables = await this.getCachedData('stratzSupportTables');

    if (isSupportTables) return isSupportTables as TSupportTables;

    const supportTables = await this.stratz.getSupportTables();

    if (!supportTables) return null;

    this.setCachedData('stratzSupportTables', supportTables, 600);

    return supportTables;
  }
  public async getLiveTournamentMatches(): Promise<MatchList | null> {
    const isStratzLiveMatches = await this.getCachedData('stratzLiveMatches');

    if (isStratzLiveMatches) return isStratzLiveMatches as MatchList;

    const stratzLiveMatches = await this.stratz.getLiveTournamentMatches();

    if (!stratzLiveMatches) return null;

    this.setCachedData('stratzLiveMatches', stratzLiveMatches, 60);

    return stratzLiveMatches;
  }

  public async getMatchIdByTeamId(teamId1?: number, teamId2?: number): Promise<number | null> {
    const stratzLiveMatches = await this.getLiveTournamentMatches();
    let matchId: number | undefined;

    if (!stratzLiveMatches) return null;

    if (!teamId2) {
      matchId = stratzLiveMatches.league.liveMatches?.find(match => teamId1 === match.radiantTeamId || teamId1 === match.direTeamId)?.matchId;
    } else {
      matchId = stratzLiveMatches.league.liveMatches?.find(match =>
        (teamId1 && match.radiantTeamId === teamId1) &&
        (teamId2 && match.direTeamId === teamId2)
      )?.matchId;
    }

    if (!matchId) return null;


    return matchId;
  }

  public async getStatisticsByMatchId(matchId: number) {
    // const stratzLiveMatches = await this.getLiveTournamentMatches();

    const matchStat = await this.stratz.getStatsByMatchId(matchId);

    return matchStat;
  }

}