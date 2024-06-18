import logger from '../module/logger';
import { getAssistant } from '../module/openAIClient';
import redisClient from '../module/redisClient';
import { betLines, winLinePandascoreTeams } from '../utils/constants';
import type { MatchList, TAllMatchData, TAvgTeamData, TBetLine, TChatWithTreadIDResponse, TMatch, TMatchData, TOdds, TPandaScoreFilteredMatch, TPandascoreLiveMatch, TPredictionResponse, TSupportTables, TWinlineEvent, TWinlineTeams } from '../utils/types';
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

  public async getCachedData(key: string): Promise<Object | null> {
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

  public async getPredictionByTeamId(teamId: number, line?: number, threadId?: string): Promise<TPredictionResponse | null> {
    const isPrediction = await this.getCachedData(`chatbotPrediction:${teamId}:${line}`) as TPredictionResponse;

    logger.info('Prediction for: ' + teamId + ' ' + line);
    if (isPrediction) {
      return isPrediction;
    }

    const matchData = await this.getMatchData('team', teamId);
    const teamName = winLinePandascoreTeams.filter(team => team.winId === teamId)[0].name;

    if (!matchData) {
      logger.error('Failed get match data in getPredictionByTeamId: ' + teamId);
      return null;
    }

    const prediction = await this.makePrediction(matchData, 'team', line, teamName, threadId);
    // const prediction = {
    //   role: 'assistant',
    //   message: 'Тут будет сообщение',
    //   threadId: "123"
    // };
    if (!prediction) {
      logger.error('Failed make prediction in getPredictionByTeamId: ' + teamId);
      return null;
    }

    await this.setCachedData(`chatbotPrediction:${teamId}:${line}`, prediction, 40);
    await this.setThreadData(prediction.threadId, matchData);

    const newBetLines: TBetLine[] = matchData.liveScore === "0:0" ? betLines : betLines.map(betLine => {
      if (betLine.id === 3) {
        return {
          ...betLine, name: "Тотал убийств на текущей карте"
        }
      }

      return betLine
    });

    return line ? prediction : { ...prediction, betLines: newBetLines };
  }

  public async getPredictionByMatchId(winlineMatchId: number, line?: number, threadId?: string): Promise<TPredictionResponse | null> {
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

    const prediction = await this.makePrediction(matchData, 'match', line, undefined, threadId);
    // const prediction = {
    //   role: 'assistant',
    //   message: 'Тут будет сообщение',
    //   threadId: "123"
    // };

    if (!prediction) {
      logger.error("Failed makePrediction " + winlineMatchId + line);
      return null;
    }

    await this.setCachedData(`chatbotPrediction:${winlineMatchId}:${line}`, prediction, 40);
    await this.setThreadData(prediction.threadId, matchData);

    const newBetLines: TBetLine[] = matchData.liveScore === "0:0" ? betLines : betLines.map(betLine => {
      if (betLine.id === 3) {
        return {
          ...betLine, name: "Тотал убийств на текущей карте"
        }
      }

      return betLine
    });

    return line ? prediction : { ...prediction, betLines: newBetLines };
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

  public async getMatchData(type: 'team' | 'match', id: number, line?: number): Promise<TMatchData | null> {

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

    const isMatchData = await this.getCachedData(`matchData:${winlineMatch.id}:${line}`) as TMatchData;

    if (isMatchData) {
      return isMatchData;
    }

    const teamId1 = winLinePandascoreTeams.find(team => team.winId === winlineMatch?.id1)?.pandaId;
    const teamId2 = winLinePandascoreTeams.find(team => team.winId === winlineMatch?.id2)?.pandaId;

    const pandascoreMatch = pandascoreMatches.filter(match => {
      if ((match.teamId1 === teamId1 || match.teamId1 === teamId2) &&
        (match.teamId2 === teamId1 || match.teamId2 === teamId2)) {
        return match
      }
    }).sort((a, b) => new Date(a.datatime).getTime() - new Date(b.datatime).getTime())[0];

    if (!pandascoreMatch) {
      logger.error('Pandascore match not found. id: ' + id + " " + teamId1 + " " + teamId2 + " " + type);
      return null;
    }

    const matchData = await this.filterMatchData(await this.pandascore.getAllDataByID(pandascoreMatch.id) as [TAllMatchData, TAvgTeamData]);

    let odds = null;
    if (winlineMatch.odds !== "") {
      line = line || 1;
      const split = matchData.liveScore.split(':');
      const mapNum = Number(split[0]) + Number(split[1]) + 1;
      odds = this.getOddsByBetLine(winlineMatch.odds, mapNum, line);
    }

    const matchDataWithOdds = { ...matchData, odds };

    if (!matchDataWithOdds) {
      logger.error('Match data not found ' + id);
      return null;
    }

    await this.setCachedData(`matchData:${winlineMatch.id}:${line}`, matchDataWithOdds, 30);
    // await this.setCachedData(`matchData:${winlineMatch.id}`, matchDataWithOdds, 30);

    return matchDataWithOdds;
  }

  private async getAssistantFromCache() {
    let assistantId = await redisClient.get("predictorAssistant") as string;

    if (!assistantId && assistantId?.length < 2) {
      getAssistant();
    }

    assistantId = await redisClient.get("predictorAssistant") as string;

    return assistantId;
  }

  private async getShortAssistantFromCache() {
    let assistantId = await redisClient.get("shortPredictorAssistant") as string;

    if (!assistantId && assistantId?.length < 2) {
      getAssistant();
    }

    assistantId = await redisClient.get("shortPredictorAssistant") as string;

    return assistantId;
  }

  private async makePrediction(matchData: TMatchData, predictionType: string, line?: number, teamName?: string, threadId?: string): Promise<TChatWithTreadIDResponse | null> {
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
      prediction = await this.getPrediction(matchData, id, predictionType === 'match' ? 'Кто победит в матче?' : `Шанс победы команды ${teamName}?`, threadId);
    } else {
      prediction = await this.getPrediction(matchData, id, betLines[line - 1].name, threadId);
    }

    if (!prediction) {
      return null;
    }

    return prediction;
  }

  private async getPrediction(matchData: TMatchData, id: string, question: string, threadId?: string): Promise<TChatWithTreadIDResponse | null> {

    const predictor = new PredictionService();
    const assistantId = await this.getAssistantFromCache();
    await redisClient.set(`predictionInProgress${id}`, "true");
    const prediction = await predictor.getPrediction(matchData, assistantId, question, threadId);

    if (!prediction) {
      logger.error('Failed get prediction ' + id);
      await redisClient.del(`predictionInProgress${id}`)
      return null;
    }

    await this.setCachedData(`chatbotPrediction:${id}`, prediction, 30);
    await redisClient.del(`predictionInProgress${id}`)

    return prediction;
  }

  public async getShortPrediction(winlineMatchId: number): Promise<{ message: string } | null> {
    const matchData = await this.getMatchData('match', winlineMatchId);

    if (!matchData) {
      logger.error("Failed getMatchData " + winlineMatchId);
      return null;
    }

    const predictor = new PredictionService();
    const assistantId = await this.getShortAssistantFromCache();

    const prediction = await predictor.getPrediction(matchData, assistantId, 'Кто победит?');

    if (!prediction) {
      logger.error("Failed makePrediction " + winlineMatchId);
      return null;
    }

    return {
      message: prediction.message as string,
    };
  }

  //Stratz

  public async getPickWinrates(radiantHeroId: number[], direHeroId: number[], matchId: number): Promise<{ radiantWinChance: string; direWinChance: string; } | null> {
    const isPickWinrates = await this.getCachedData(`stratzPickWinrates${matchId}`);

    if (isPickWinrates) return isPickWinrates as { radiantWinChance: string; direWinChance: string; };

    const pickWinrate = await this.stratz.getPickWinrateByHeroIds(radiantHeroId, direHeroId);

    if (!pickWinrate) {
      logger.error('Failed get pick winrate ' + radiantHeroId + ' ' + direHeroId);
      return null;
    }

    this.setCachedData(`stratzPickWinrates${matchId}`, pickWinrate, 1200);

    return {
      ...pickWinrate
    };
  }

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

  private async filterMatchData(data: [TAllMatchData, TAvgTeamData]): Promise<TMatchData> {
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
    const liveScore = `${finishedMatches.filter(game => game.winner_id === teamData.opponents[0].id).length}:${finishedMatches.filter(game => game.winner_id === teamData.opponents[1].id).length}`

    let liveMatch: TPandascoreLiveMatch | undefined;
    let radiantHeroesIds: number[] = [];
    let direHeroesIds: number[] = [];

    if (matchesData.match_status === 'running') {
      liveMatch = matchesData.games.map(game => {
        if (game.status === "running" && game.timer.timer !== null) {
          radiantHeroesIds = game.opponents[0].side === "radiant" ? game.opponents[0].heroes.map(hero => hero.id) : game.opponents[1].heroes.map(hero => hero.id);
          direHeroesIds = game.opponents[1].side === "dire" ? game.opponents[1].heroes.map(hero => hero.id) : game.opponents[0].heroes.map(hero => hero.id);
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
    }

    if (liveMatch) {
      const winChance = await this.getPickWinrates(radiantHeroesIds, direHeroesIds, matchesData.id);
      liveMatch.team1.pickWinChance = formatPercent(Number(winChance?.radiantWinChance));
      liveMatch.team2.pickWinChance = formatPercent(Number(winChance?.direWinChance));
    }

    const team1Stats = teamData.opponents[0].stats;
    const team2Stats = teamData.opponents[1].stats;

    return {
      matchId: matchesData.id,
      matchStatus: matchesData.match_status,
      matchType: `Best of ${matchesData.games.length}`,
      liveScore: liveScore,
      liveMatch: liveMatch,
      matchUps: matchesData.encounters.map(match => {
        let team1 = match.opponents[0];
        let team2 = match.opponents[1];

        return {
          teamName1: team1.name,
          teamName2: team2.name,
          score: team1.score + ":" + team2.score,
          matchTime: match.modified_at.split('T')[0],
          winningTeam: match.winner_id === team1.id ? team1.name : team2.name,
        }
      }),
      team1: {
        teamName: matchesData.opponents[0].name,
        worldRatingPlacement: winLinePandascoreTeams.find(team => team.pandaId === matchesData.opponents[0].id)?.rating || null,
        lastMatches: matchesData.opponents[0].form.map(match => {
          let team1 = match.opponents[0];
          let team2 = match.opponents[1];
          return {
            teamName1: team1.name,
            worldRatingPlacement1: winLinePandascoreTeams.find(team => team.pandaId === team1.id)?.rating || null,
            teamName2: team2.name,
            worldRatingPlacement2: winLinePandascoreTeams.find(team => team.pandaId === team2.id)?.rating || null,
            matchResult: match.winner_id === matchesData.opponents[0].id ? "WIN" : "LOSE",
            score: team1.score + ":" + team2.score,
            matchTime: match.modified_at.split('T')[0],
            winningTeam: match.winner_id === team1.id ? team1.name : team2.name,
          }
        }),
        killAvg: team1Stats.kills,
        gameLengthAvg: convertTime(team1Stats.average_game_length) + " минут",
        towerKillAvg: team1Stats.towers,
        barracksKillAvg: team1Stats.barracks,
        radiantWinrate: formatPercent(team1Stats.radiant_winrate),
        direWinrate: formatPercent(team1Stats.dire_winrate),
        firstBloodPercent: formatPercent(team1Stats.first_blood_percentage),
        gpmAvg: team1Stats.gold_per_minute,
        mostPicked: team1Stats.most_picked.map(hero => {
          return { name: hero.name, count: hero.number_of_picks, presence: formatPercent(hero.presence_percentage) }
        }),
        mostBannedAgainst: team1Stats.most_banned_against.map(hero => {
          return { name: hero.name, count: hero.number_of_picks, presence: formatPercent(hero.presence_percentage) }
        }),
        players: team1Stats.players.map(player => player.name),
        playersStats: team1Stats.players.map(player => {
          return {
            name: player.name,
            killAvg: player.kills,
            deathAvg: player.deaths,
            assistAvg: player.assists,
            position: player.position,
            mostPickedHero: player.most_picked.map(hero => hero.name),
            lastHitAvg: player.last_hits
          }
        })
      },
      team2: {
        teamName: matchesData.opponents[1].name,
        worldRatingPlacement: winLinePandascoreTeams.find(team => team.pandaId === matchesData.opponents[1].id)?.rating || null,
        lastMatches: matchesData.opponents[1].form.map(match => {
          let team1 = match.opponents[0];
          let team2 = match.opponents[1];
          return {
            teamName1: team1.name,
            worldRatingPlacement1: winLinePandascoreTeams.find(team => team.pandaId === team1.id)?.rating || null,
            teamName2: team2.name,
            worldRatingPlacement2: winLinePandascoreTeams.find(team => team.pandaId === team2.id)?.rating || null,
            matchResult: match.winner_id === matchesData.opponents[1].id ? "WIN" : "LOSE",
            score: team1.score + ":" + team2.score,
            matchTime: match.modified_at.split('T')[0],
            winningTeam: match.winner_id === team1.id ? team1.name : team2.name,
          }
        }),
        killAvg: team2Stats?.kills,
        gameLengthAvg: convertTime(team2Stats?.average_game_length) + " минут",
        towerKillAvg: team2Stats?.towers,
        barracksKillAvg: team2Stats?.barracks,
        radiantWinrate: formatPercent(team2Stats?.radiant_winrate),
        direWinrate: formatPercent(team2Stats?.dire_winrate),
        firstBloodPercent: formatPercent(team2Stats?.first_blood_percentage),
        gpmAvg: team2Stats?.gold_per_minute,
        mostPicked: team2Stats?.most_picked.map(hero => {
          return { name: hero.name, count: hero.number_of_picks, presence: formatPercent(hero.presence_percentage) }
        }),
        mostBannedAgainst: team2Stats?.most_banned_against.map(hero => {
          return { name: hero.name, count: hero.number_of_picks, presence: formatPercent(hero.presence_percentage) }
        }),
        players: team2Stats?.players.map(player => player.name),
        playersStats: team1Stats.players.map(player => {
          return {
            name: player.name,
            killAvg: player.kills,
            deathAvg: player.deaths,
            assistAvg: player.assists,
            position: player.position,
            mostPickedHero: player.most_picked.map(hero => hero.name),
            lastHitAvg: player.last_hits
          }
        })
      }
    }
  };

  private getOddsByBetLine(odds: { line: TOdds[] }, mapNum: number, betLineId: number) {
    //filter 
    // 1 - Победитель, 1/2/3 карта исход
    // 2 - Точный счет по картам 
    // 3 - Тотал убийств, 1/2/3 тотал убийств меньше\больше (45.5, 46.5)
    // 4 - фора убийств, 1/2/3 карта фора убийств меньше\больше (-5.5, -6.5, -7.5)
    if (betLineId == 1) {
      return odds.line.map(odd => {
        if (odd.freetext === 'Победитель') {
          return {
            name: "Победитель",
            odd1: odd.odd1,
            odd2: odd.odd2,
          }
        }
        // if (odd.freetext === `${mapNum} карта Исход 12`) {
        //   return {
        //     name: `${mapNum} карта Исход`,
        //     odd1: odd.odd1,
        //     odd2: odd.odd2,
        //   }
        // }
        if (odd.freetext === '1X2 (Основное время)') {
          return {
            name1: "Победа первой команды",
            odd1: odd.odd1,
            name2: "Ничья",
            odd2: odd.odd2,
            name3: "Победа второй команды",
            odd3: odd.odd3
          }
        }
      }).filter(odd => odd !== undefined);
    }

    if (betLineId == 2) {
      return odds.line.map(odd => {
        if (odd.freetext === 'Точный счет по картам') {
          return { ...odd }
        }
      }).filter(odd => odd !== undefined);
    }

    if (betLineId == 3) {
      return odds.line.map(odd => {
        if (odd.freetext === `${mapNum} карта Тотал убийств`) {
          return { ...odd }
        }
      }).filter(odd => odd !== undefined);
    }

    if (betLineId == 4) {
      return odds.line.map(odd => {
        if (odd.freetext === `${mapNum} карта Фора убийств`) {
          return { ...odd }
        }
      }).filter(odd => odd !== undefined);
    }
  };

  private async setThreadData(threadId: string, matchData: TMatchData) {

    await this.setCachedData(`threadData:${threadId}`, {
      status: matchData.matchStatus,
      team1: {
        name: matchData.team1.teamName,
        players: matchData.team1.players,
        heroes: matchData.liveMatch?.team1.heroes.map((hero: { name: string; winRate: string; }) => hero.name) || []
      },
      team2: {
        name: matchData.team2.teamName,
        players: matchData.team2.players,
        heroes: matchData.liveMatch?.team2.heroes.map((hero: { name: string; winRate: string; }) => hero.name) || []
      },
    }, 60 * 10);
  };
}