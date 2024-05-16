import logger from '../module/logger';
import { getAssistant } from '../module/openAIClient';
import redisClient from '../module/redisClient';
import { betLines, winLinePandascoreTeamsPGL } from '../utils/constants';
import type { MatchList, TAllMatchData, TAvgTeamData, TChatWithTreadIDResponse, TMatch, TMatchData, TPandaScoreFilteredMatch, TPredictionResponse, TSupportTables, TWinlineEvent, TWinlineTeams } from '../utils/types';
import { PandascoreService } from './pandascore.service';
import PredictionService from './pediction.service';
// import { SocketService } from './socket.service';
import StratzService from './stratz.service';
import TeamService from './team.service';
import { WinlineMatchService } from './winlineMatches.service';

export class CachedService {
  protected redisClient: any;
  protected winlineMatches: WinlineMatchService;
  protected stratz: StratzService;
  protected teams: TeamService;
  protected pandascore: PandascoreService;

  constructor() {
    this.redisClient = redisClient;

    this.winlineMatches = new WinlineMatchService();
    this.stratz = new StratzService();
    this.teams = new TeamService();
    this.pandascore = new PandascoreService();
    this.teams = new TeamService();
  }

  public async getWinlineTeams() {
    const isTeams = await this.getCachedData('winlineTeams') as TWinlineTeams[];

    if (isTeams) {
      return isTeams;
    }

    const allMatches = await this.getWinlineMatchesByTeamIdAndTime(undefined, 'today');

    if (!allMatches) {
      logger.error('Failed get all matches in getWinlineTeams');
      return null;
    }

    const winlineTeams = this.teams.getTeams(allMatches);


    this.setCachedData('winlineTeams', winlineTeams, 60);

    return winlineTeams;
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

  private async getAllMatches(): Promise<TMatch[] | null> {
    const isAllMatches = await this.getCachedData('winlineAllMatches') as TWinlineEvent[];

    if (isAllMatches) {
      return isAllMatches;
    }

    const winlineAllMatches = await this.winlineMatches.getAllMatches();

    if (winlineAllMatches.length === 0) return null;

    this.setCachedData('winlineAllMatches', winlineAllMatches);

    return winlineAllMatches;
  }

  public async getWinlineMatchesByTeamIdAndTime(teamId?: number, matchTime: 'today' | 'tomorrow' = 'today'): Promise<TMatch[] | null> {
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

    if (Array.isArray(matches)) return null;

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

    return null;
  }

  public async getPredictionByTeamId(teamId: number, line?: number): Promise<TPredictionResponse | null> {
    const isPrediction = await this.getCachedData(`chatbotPrediction:${teamId}:${line}`) as TPredictionResponse;

    logger.info('Prediction for: ' + teamId + ' ' + line);
    if (isPrediction) {
      return isPrediction;
    }

    const matchData = await this.getMatchData('team', teamId);

    if (!matchData) {
      logger.error('Failed get match data in getPredictionByTeamId: ' + teamId);
      return null;
    }

    const prediction = await this.makePrediction(matchData, line);

    if (!prediction) {
      logger.error('Failed make prediction in getPredictionByTeamId: ' + teamId);
      return null;
    }

    await this.setCachedData(`chatbotPrediction:${teamId}:${line}`, prediction, 40);

    return line ? prediction : { ...prediction, betLines };
  }

  public async getPredictionByMatchId(winlineMatchId: number, line?: number): Promise<TPredictionResponse | null> {
    const isPrediction = await this.getCachedData(`chatbotPrediction:${winlineMatchId}:${line}`) as TPredictionResponse;
    logger.info('Prediction for: ' + winlineMatchId + ' ' + line);
    if (isPrediction) {
      return isPrediction;
    }

    const matchData = await this.getMatchData('match', winlineMatchId);

    if (!matchData) {
      logger.error("Failed getMatchData " + winlineMatchId);
      return null;
    }

    const prediction = await this.makePrediction(matchData, line);

    if (!prediction) {
      logger.error("Failed makePrediction " + winlineMatchId + line);
      return null;
    }

    await this.setCachedData(`chatbotPrediction:${winlineMatchId}:${line}`, prediction, 40);

    return line ? prediction : { ...prediction, betLines };
  }

  private async awaitPrediction(id: string) {
    const startTime = Date.now();
    const timeout = 1000 * 60 * 1; // 1 min
    const awaitInterval = 5000; // 5 sec

    while (await redisClient.get(`predictionInProgress${id}`) === 'true') {
      const elapsed = Date.now() - startTime;

      if (elapsed > timeout) {
        logger.error(`Awaiting prediction: ${id} timeout`);
        return null;
      }

      await new Promise(resolve => setTimeout(resolve, awaitInterval));
    }

    return this.getCachedData(`chatbotPrediction:${id}`);
  }

  public async getMatchData(type: 'team' | 'match', id: number) {

    const winlineMatches = await this.getAllMatches();
    const pandascoreMatches = await this.getPandascoreMatches();

    if (!winlineMatches || !pandascoreMatches) {
      logger.error('Winline or pandascore matches not found');
      return null;
    }

    let winlineMatch;

    if (type === 'match') {
      winlineMatch = winlineMatches.find(match => Number(match.id) === id);
    } else {
      winlineMatch = winlineMatches.find(match => match.id1 === id || match.id2 === id);
    }

    if (!winlineMatch) {
      logger.error('Winline match not found. id: ' + id);
      return null;
    }

    const isMatchData = await this.getCachedData(`matchData:${winlineMatch.id}`) as TMatchData;

    if (isMatchData) {
      return isMatchData;
    }

    const teamId1 = winLinePandascoreTeamsPGL.find(team => team.winId === winlineMatch?.id1)?.pandaId;
    const teamId2 = winLinePandascoreTeamsPGL.find(team => team.winId === winlineMatch?.id2)?.pandaId;

    const pandascoreMatch = pandascoreMatches.filter(match => {
      if (winlineMatch.isMatchLive) {
        if (match.status === 'running') {
          return match;
        }
      } else {
        if (match.teamId1 === teamId1 &&
          match.teamId2 === teamId2) {
          return match
        }
      }
    }).sort((a, b) => new Date(a.datatime).getTime() - new Date(b.datatime).getTime())[0];

    const matchData = this.filterMatchData(await this.pandascore.getAllDataByID(pandascoreMatch.id) as [TAllMatchData, TAvgTeamData]);

    if (!matchData) {
      logger.error('Match data not found ' + id);
      return null;
    }

    await this.setCachedData(`matchData:${winlineMatch.id}`, matchData, 30);

    return matchData;
  }

  private async getAssistantFromCache() {
    let assistantId = await redisClient.get("predictorAssistant") as string;

    if (!assistantId) {
      getAssistant();
    }

    assistantId = await redisClient.get("predictorAssistant") as string;

    return assistantId;
  }

  private async makePrediction(matchData: TMatchData, line?: number): Promise<TChatWithTreadIDResponse | null> {
    const id = line ? `${matchData.matchId}:${line}` : `${matchData.matchId}`;
    const isPredictionInProgress = await redisClient.get(`predictionInProgress${id}`) as string;

    if (isPredictionInProgress) {
      const prediction = await this.awaitPrediction(id) as TChatWithTreadIDResponse;

      if (!prediction) {
        logger.error('Failed await prediction ' + id);
        await redisClient.del(`predictionInProgress${id}`)
        return null;

      }
      return prediction;
    }
    let prediction: TChatWithTreadIDResponse | null;

    if (!line) {
      prediction = await this.getPrediction(matchData, id, 'Кто победит?');
    } else {
      prediction = await this.getPrediction(matchData, id, betLines[line - 1].name);
    }

    if (!prediction) {
      return null;
    }

    return prediction;
  }

  private async getPrediction(matchData: TMatchData, id: string, question: string): Promise<TChatWithTreadIDResponse | null> {

    const predictor = new PredictionService();
    const assistantId = await this.getAssistantFromCache();
    await redisClient.set(`predictionInProgress${id}`, "true");
    const prediction = await predictor.getPrediction(matchData, assistantId, question);

    if (!prediction) {
      logger.error('Failed get prediction ' + id);
      await redisClient.del(`predictionInProgress${id}`)
      return null;
    }

    await this.setCachedData(`chatbotPrediction:${id}`, prediction, 30);
    await redisClient.del(`predictionInProgress${id}`)

    return prediction;
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

  //Pandascore
  public async getPandascoreMatches(): Promise<TPandaScoreFilteredMatch[] | null> {
    const isPandascoreMatches = await this.getCachedData('pandascoreMatches') as TPandaScoreFilteredMatch[];

    if (isPandascoreMatches) return isPandascoreMatches;

    const pandascoreMatches = await this.pandascore.getAllMatches();

    if (!pandascoreMatches) return null;

    this.setCachedData('pandascoreMatches', pandascoreMatches, 60);

    return pandascoreMatches;
  }

  private filterMatchData(data: [TAllMatchData, TAvgTeamData]) {
    let matchesData: TAllMatchData | null = data[0];
    let teamData: TAvgTeamData | null = data[1];

    const formatPercent = (num: number) => {
      return (num * 100).toFixed(2) + "%";
    }

    const convertTime = (time: number) => {
      const minutes = `${Math.floor(time / 60)}`.padStart(2, "0");
      const seconds = `${time - Number(minutes) * 60}`.padStart(2, "0");
      return `${minutes}:${seconds}`;
    }
    
    const finishedMatches = matchesData.games.filter(game => game.status === 'finished');
    const liveScore = `${finishedMatches.filter(game => game.winner_id === teamData.opponents[0].id).length} : ${finishedMatches.filter(game => game.winner_id === teamData.opponents[1].id).length}`

    let liveMatch;
    if (matchesData.match_status === 'running') {
      liveMatch = matchesData.games.map(game => {
        if (game.status === "running" && game.timer.timer !== null) {

          return {
            inGameTime: convertTime(game.timer.timer) + " минут",
            team1: {
              teamName: teamData.opponents[0].id === game.opponents[0].id ? teamData.opponents[0].name : teamData.opponents[1].name,
              heroes: game.opponents[0].heroes.map(hero => {
                return {
                  name: hero.name,
                  winRate: formatPercent(hero.winrate)
                }
              }),
              side: game.opponents[0].side,
              kills: game.opponents[0].kills,
              towerAlive: game.opponents[0].tower_status,
              towersKills: game.opponents[0].towers
            },
            team2: {
              teamName: teamData.opponents[1].id === game.opponents[1].id ? teamData.opponents[1].name : teamData.opponents[0].name,
              heroes: game.opponents[1].heroes.map(hero => {
                return {
                  name: hero.name,
                  winRate: formatPercent(hero.winrate)
                }
              }),
              side: game.opponents[1].side,
              kills: game.opponents[1].kills,
              towerAlive: game.opponents[1].tower_status,
              towersKills: game.opponents[1].towers
            },
            radiantGoldAdvantage: game.radiant_gold_adv.pop()?.value,
          }
        }
      }).filter(match => match)[0];
      // console.log(liveMatch);
    }

    return {
      matchId: matchesData.id,
      match_status: matchesData.match_status,
      liveMatch: liveMatch,
      liveScore: liveScore,
      matchUps: matchesData.encounters.map(match => {
        let team1 = match.opponents[0];
        let team2 = match.opponents[1];

        return {
          teamName1: team1.name,
          teamName2: team2.name,
          score: team1.score + " : " + team2.score,
          winningTeam: match.winner_id === team1.id ? team1.name : team2.name,
        }
      }),
      team1: {
        teamName: matchesData.opponents[0].name,
        lastMatches: matchesData.opponents[0].form.map(match => {
          let team1 = match.opponents[0];
          let team2 = match.opponents[1];
          return {
            teamName1: team1.name,
            teamName2: team2.name,
            score: team1.score + " : " + team2.score,
            winningTeam: match.winner_id === team1.id ? team1.name : team2.name,
          }
        }),
        killAvg: teamData.opponents[0].stats.kills,
        gameLengthAvg: convertTime(teamData.opponents[0].stats.average_game_length) + " минут",
        towerKillAvg: teamData.opponents[0].stats.towers,
        barracksKillAvg: teamData.opponents[0].stats.barracks,
        radiantWinrate: formatPercent(teamData.opponents[0].stats.radiant_winrate),
        direWinrate: formatPercent(teamData.opponents[0].stats.dire_winrate),
        firstBloodPercent: formatPercent(teamData.opponents[0].stats.first_blood_percentage),
        gpmAvg: teamData.opponents[0].stats.gold_per_minute,
        mostPicked: teamData.opponents[0].stats.most_picked.map(hero => {
          return { name: hero.name, presence: formatPercent(hero.presence_percentage) }
        }),
        mostBannedAgainst: teamData.opponents[0].stats.most_banned_against.map(hero => {
          return { name: hero.name, presence: formatPercent(hero.presence_percentage) }
        }),
        players: teamData.opponents[0].stats.players.map(player => player.name)
      },
      team2: {
        teamName: matchesData.opponents[1].name,
        lastMatches: matchesData.opponents[1].form.map(match => {
          let team1 = match.opponents[0];
          let team2 = match.opponents[1];
          return {
            teamName1: team1.name,
            teamName2: team2.name,
            score: team1.score + " : " + team2.score,
            winningTeam: match.winner_id === team1.id ? team1.name : team2.name,
          }
        }),
        killAvg: teamData.opponents[1].stats.kills,
        gameLengthAvg: convertTime(teamData.opponents[1].stats.average_game_length) + " минут",
        towerKillAvg: teamData.opponents[1].stats.towers,
        barracksKillAvg: teamData.opponents[1].stats.barracks,
        radiantWinrate: formatPercent(teamData.opponents[1].stats.radiant_winrate),
        direWinrate: formatPercent(teamData.opponents[1].stats.dire_winrate),
        firstBloodPercent: formatPercent(teamData.opponents[1].stats.first_blood_percentage),
        gpmAvg: teamData.opponents[1].stats.gold_per_minute,
        mostPicked: teamData.opponents[1].stats.most_picked.map(hero => {
          return { name: hero.name, presence: formatPercent(hero.presence_percentage) }
        }),
        mostBannedAgainst: teamData.opponents[1].stats.most_banned_against.map(hero => {
          return { name: hero.name, presence: formatPercent(hero.presence_percentage) }
        }),
        players: teamData.opponents[1].stats.players.map(player => player.name)
      }
    }
  }
}