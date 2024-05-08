import redisClient from '../module/redisClient';
import { betLines, winLinePandascoreTeamsEPL } from '../utils/constants';
import type { MatchList, TAllMatchData, TAvgTeamData, TMatch, TMatchData, TPandaScoreFilteredMatch, TSupportTables, TWinlineEvent, TWinlineTeams } from '../utils/types';
import { PandascoreService } from './pandascore.service';
import PredictionService from './pediction.service';
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

    const allMatches = await this.getWinlineMatchesByTeamIdAndTime(undefined, 'today');

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


  public async getPredictionByTeamId(teamId: number, line?: number) {
    //проверка в кэше
    const isPrediction = line ? await this.getCachedData(`chatbotPrediction:${teamId}:${line}`) : await this.getCachedData(`chatbotPrediction:${teamId}`);

    if (isPrediction) {
      return isPrediction;
    }

    const isMatchData = await this.getCachedData(`matchData:${teamId}`) as TMatchData;
    let matchData = isMatchData;

    if (!isMatchData) {
      //В кэше нет собираем всю инфу
      const winlineMatches = await this.getAllMatches();
      const pandascoreMatches = await this.getPandascoreMatches();

      const winlineMatch = winlineMatches.find(match => match.id1 === teamId || match.id2 === teamId);
      const teamId1 = winLinePandascoreTeamsEPL.find(team => team.winId === winlineMatch?.id1)?.pandaId;
      const teamId2 = winLinePandascoreTeamsEPL.find(team => team.winId === winlineMatch?.id2)?.pandaId;


      if (!winlineMatch) {
        console.error('Prediction module', 'Winline match not found', "Team id: " + teamId);
        return null;
      }

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

      //Если не нашли матч в pandascore
      if (!pandascoreMatch) {
        console.error('Prediction module', 'Pandascore match not found', teamId);
        return null;
      }

      matchData = this.filterMatchData(await this.pandascore.getAllDataByID(pandascoreMatch.id) as [TAllMatchData, TAvgTeamData]);

      if (!matchData) {
        console.error('Prediction module', 'Match data not found', teamId);
        return null;
      }
      await this.setCachedData(`matchData:${teamId}`, matchData, 30);
    }

    //Генерируем предикшен по матчу
    const predictor = new PredictionService();
    const assistantId = await redisClient.get("predictorAssistant") as string;

    if (!line) {

      const isPredictionInProgress = await redisClient.get(`predictionInProgress${teamId}`) as string;
      console.log(isPredictionInProgress);

      if (isPredictionInProgress) {
        const prediction = await this.awaitPrediction(`${teamId}`);
        return {
          ...prediction,
          betLines
        };;
      }

      await redisClient.set(`predictionInProgress${teamId}`, "true");
      const prediction = await predictor.getWinPrediction(matchData, assistantId);

      if (!prediction) {
        console.error('Prediction module', 'Failed get prediction', teamId);
        await redisClient.del(`predictionInProgress${teamId}`);
        return null;
      }

      await this.setCachedData(`chatbotPrediction:${teamId}`, prediction, 30);
      await redisClient.del(`predictionInProgress${teamId}`);

      return {
        ...prediction,
        betLines
      };
    } else {
      const lineName = betLines[line - 1];
      const question = lineName.name;

      const isPredictionInProgress = await redisClient.get(`predictionInProgress${teamId}:${line}`) as string;

      if (isPredictionInProgress) {
        const prediction = await this.awaitPrediction(`${teamId}:${line}`);
        await redisClient.set(`predictionInProgress${teamId}:${line}`, "false");
        return prediction;
      }

      await redisClient.set(`predictionInProgress${teamId}`, "true");
      const prediction = await predictor.getPredictionByBetLine(matchData, assistantId, question);

      if (!prediction) {
        console.error('Prediction module', 'Failed get prediction', teamId, question);
        await redisClient.del(`predictionInProgress${teamId}:${line}`);
        return null;
      }

      await this.setCachedData(`chatbotPrediction:${teamId}:${line}`, prediction, 30);
      await redisClient.set(`predictionInProgress${teamId}:${line}`, "false");

      return prediction;
    }
  }

  private filterMatchData(data: [TAllMatchData, TAvgTeamData]) {
    let matchesData: TAllMatchData = data[0];
    let teamData: TAvgTeamData = data[1];

    const formatPercent = (num: number) => {
      return (num * 100).toFixed(2) + "%";
    }

    const convertTime = (time: number) => {
      const minutes = `${Math.floor(time / 60)}`.padStart(2, "0");
      const seconds = `${time - Number(minutes) * 60}`.padStart(2, "0");
      return `${minutes}:${seconds}`;
    }

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
        gameLengthAvg: teamData.opponents[0].stats.average_game_length / 60 + ' минут',
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
        gameLengthAvg: teamData.opponents[1].stats.average_game_length / 60 + ' минут',
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

  public async getPredictionByMatchId(winlineMatchId: number, line?: number) {

    const isPrediction = line ? await this.getCachedData(`chatbotPrediction:${winlineMatchId}:${line}`) : await this.getCachedData(`chatbotPrediction:${winlineMatchId}`);

    if (isPrediction) {
      return isPrediction;
    }

    console.time('getPredictionByMatchId');
    const isMatchData = await this.getCachedData(`matchData:${winlineMatchId}`) as TMatchData;
    let matchData = isMatchData;

    if (!isMatchData) {
      const winlineMatches = await this.getAllMatches();
      const pandascoreMatches = await this.getPandascoreMatches();

      const winlineMatch = winlineMatches.find(match => Number(match.id) === winlineMatchId);
      const teamId1 = winLinePandascoreTeamsEPL.find(team => team.winId === winlineMatch?.id1)?.pandaId;
      const teamId2 = winLinePandascoreTeamsEPL.find(team => team.winId === winlineMatch?.id2)?.pandaId;

      if (!winlineMatch) {
        console.error('Prediction module', 'Winline match not found', "Mach id: " + winlineMatchId);
        return null;
      }

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

      matchData = this.filterMatchData(await this.pandascore.getAllDataByID(pandascoreMatch.id) as [TAllMatchData, TAvgTeamData]);

      if (!matchData) {
        console.error('Prediction module', 'Match data not found', winlineMatchId);
        return null;
      }

      await this.setCachedData(`matchData:${winlineMatchId}`, matchData, 30);
    }
    console.timeEnd("getPredictionByMatchId")

    const predictor = new PredictionService();
    const assistantId = await redisClient.get("predictorAssistant") as string;
    if (!line) {
      const isPredictionInProgress = await redisClient.get(`predictionInProgress${winlineMatchId}`) as string;

      if (isPredictionInProgress) {
        const prediction = await this.awaitPrediction(winlineMatchId.toString());
        return {
          ...prediction,
          betLines
        }
      }

      await redisClient.set(`predictionInProgress${winlineMatchId}`, "true");

      const prediction = await predictor.getWinPrediction(matchData, assistantId);

      if (!prediction) {
        console.error('Prediction module', 'Failed get prediction', winlineMatchId);
        await redisClient.del(`predictionInProgress${winlineMatchId}`)
        return null;
      }

      await this.setCachedData(`chatbotPrediction:${winlineMatchId}`, prediction, 30);
      await redisClient.del(`predictionInProgress${winlineMatchId}`)

      return {
        ...prediction,
        betLines
      };
    } else {
      const lineName = betLines[line - 1];
      const question = lineName.name;

      const isPredictionInProgress = await redisClient.get(`predictionInProgress${winlineMatchId}:${line}`) as string;

      if (isPredictionInProgress) {
        const prediction = await this.awaitPrediction(`${winlineMatchId}:${line}`);
        return prediction;
      }
      await redisClient.set(`predictionInProgress${winlineMatchId}:${line}`, "true");

      const prediction = await predictor.getPredictionByBetLine(matchData, assistantId, question);
      if (!prediction) {
        console.error('Prediction module', 'Failed get prediction', winlineMatchId, line);
        await redisClient.del(`predictionInProgress${winlineMatchId}:${line}`)
        return null;
      }

      await this.setCachedData(`chatbotPrediction:${winlineMatchId}:${line}`, prediction, 30);
      await redisClient.del(`predictionInProgress${winlineMatchId}:${line}`)

      return prediction;
    }

    //Get real matchId by winlineMatchId
    // const allMatches = await this.getAllMatches();
    // const teams = this.teams.getTeamsByWinlineMatchId(winlineMatchId, allMatches);

    // // if (!teams?.id1 && !teams?.id2) {
    // //   console.error('No teams found');
    // //   return null;
    // // }
    // const matchId = 7705557154;
    // // const matchId = await this.getMatchIdByTeamId(teams.id1, teams.id2);
    // // const supportTables = await this.getSupportTables();

    // if (!matchId) {
    //   console.error('No matchId in stratz found');
    //   return null
    // };

    // //get stats by matchId
    // const matchStat = await this.getStatisticsByMatchId(matchId);

    // if (!matchStat) {
    //   console.error(`Stratz failed to get statistics for matchId: ${matchId}`);
    //   return null
    // }

    // return matchStat;

    // return supportTables;

    //get prediction

    //set cache

    //return
  }

  private async awaitPrediction(id: string) {
    let isPredictionInProgress = await redisClient.get(`predictionInProgress${id}`) as string;

    while (isPredictionInProgress === 'true') {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      // console.log(`Awaiting prediction: ${id}`);
      isPredictionInProgress = await redisClient.get(`predictionInProgress${id}`) as string;
    }

    return this.getCachedData(`chatbotPrediction:${id}`);
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
  public async getPandascoreMatches(): Promise<TPandaScoreFilteredMatch[] | []> {
    const isPandascoreMatches = await this.getCachedData('pandascoreMatches') as TPandaScoreFilteredMatch[];

    if (isPandascoreMatches) return isPandascoreMatches;

    const pandascoreMatches = await this.pandascore.getAllMatches();

    if (!pandascoreMatches) return [];

    this.setCachedData('pandascoreMatches', pandascoreMatches, 60);

    return pandascoreMatches;
  }



}