import redisClient from '../module/redisClient';
import { GameEnum, TournamentEnum, getWinlineAllMatches, getWinlineLiveMatches, type TWinlineEvent } from '../utils/xmlParser';
import _ from 'lodash';


type TMatch = Omit<TWinlineEvent, 'TV' | 'isLive' | 'sport' | 'country'>;


export default class SupportService {
  constructor() { }

  public async getTeams() {
    const allMatches = await this.getAllMatches();

    const uniqTeams = _.unionBy(
      Array.from(
        [...allMatches.map(team => {
          if (team) return ({ id: team.id1, name: team.team1 })
        }),
        ...allMatches.map(team => {
          if (team) return ({ id: team.id2, name: team.team2 })
        })]
      ), 'id');


    return uniqTeams;
  }

  public async getMatches(teamId?: number, matchTime: 'today' | 'tomorrow' = 'today'):
    Promise<TMatch[] | null> {
      
    try {
      //Team predictions
      if (teamId && matchTime === 'today') {
        return this.getTodayMatchesByTeamId(teamId);
      }

      //All matches today
      if (!teamId && matchTime === 'today') {
        return this.getTodayMatches();
      }

      //All matches tomorrow
      if (!teamId && matchTime === 'tomorrow') {
        return this.getTomorrowMatches();
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  private async getAllMatches() {
    let allMatches: TWinlineEvent[];

    const isAllMatches = await redisClient.get('allMatches');

    if (isAllMatches && isAllMatches.length > 2) {
      allMatches = JSON.parse(isAllMatches);
      return allMatches;
    }

    const req = await Promise.all([this.getUpcomingMatches(), this.getLiveMatchesWinline()]);
    allMatches = req.flatMap((item) => (item || []));

    await redisClient.set('allMatches', JSON.stringify(allMatches), { EX: 20 });

    return allMatches;
  }
  private async getTodayMatchesByTeamId(teamId: number) {
    const allMatches = await this.getAllMatches();

    return allMatches.map(item => {
      return _.omit(item, ['TV', 'isLive', 'sport', 'country']);
    })
  }

  private async getTodayMatches(): Promise<TMatch[] | null> {
    const allMatches = await this.getAllMatches();

    const filteredMatches = allMatches.filter(
      ({ datetime }) => new Date(datetime).toLocaleDateString('en-EN', { timeZone: 'Europe/Moscow' }) ===
        new Date(Date.now()).toLocaleDateString('en-EN', { timeZone: 'Europe/Moscow' })
    );

    return filteredMatches.length ? filteredMatches.map(item => _.omit(item, ['TV', 'isLive', 'sport', 'country',])) : null;
  }

  private async getTomorrowMatches(): Promise<TMatch[] | null> {
    const tomorrowMatches = await this.getUpcomingMatches();

    if (!tomorrowMatches) return null;

    const filteredMatches = tomorrowMatches.filter(
      ({ datetime }) =>
        new Date(datetime).toLocaleDateString('en-EN', { timeZone: 'Europe/Moscow' }) >
        new Date(Date.now()).toLocaleDateString('en-EN', { timeZone: 'Europe/Moscow' })
    );

    return filteredMatches.length ? filteredMatches.map(item => _.omit(item, ['TV', 'isLive', 'sport', 'country'])) : null;

  }

  private async getLiveMatchesWinline(): Promise<TWinlineEvent[] | null> {
    // let winlineLiveMatches: TWinlineEvent[];
    const isLiveMatches = await redisClient.get('liveMatches');

    if (isLiveMatches && isLiveMatches.length > 2) {
      return JSON.parse(isLiveMatches) as TWinlineEvent[];
    }

    const winlineLiveMatches = await getWinlineLiveMatches({
      game: GameEnum.DOTA_2,
      tournament: TournamentEnum.esl_one
    });

    if (!winlineLiveMatches) {
      return null;
    }

    await redisClient.set('liveMatches', JSON.stringify(winlineLiveMatches), { EX: 5 });

    return winlineLiveMatches;
  }

  private async getUpcomingMatches() {
    const isUpcomingMatches = await redisClient.get('upcomingMatches');

    if (isUpcomingMatches && isUpcomingMatches.length > 2) {
      return JSON.parse(isUpcomingMatches) as TWinlineEvent[];
    }

    const winlineAllMatches = await getWinlineAllMatches({
      game: GameEnum.DOTA_2,
      tournament: TournamentEnum.esl_one
    });

    if (!winlineAllMatches) {
      return null;
    }

    await redisClient.set('upcomingMatches', JSON.stringify(winlineAllMatches), { EX: 5 });

    return winlineAllMatches;
  }
}