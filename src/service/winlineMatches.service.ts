import type { TMatch, TMatchResponse, TWinlineEvent } from '../utils/types';
import { GameEnum, TournamentEnum, getWinlineAllMatches, getWinlineLiveMatches, type TFilter } from '../utils/xmlParser';
import _ from 'lodash';


export class WinlineMatchService {
  protected config: TFilter;
  constructor() {
    this.config = {
      game: GameEnum.DOTA_2,
      tournament: TournamentEnum.riyadh_masters_qualifier
    }
  }
  public async getMatches(teamId?: number, matchTime: 'today' | 'tomorrow' = 'today'):
    Promise<TMatchResponse | []> {

    try {
      //Team predictions
      if (teamId && matchTime === 'today') {
        return {
          type: 'team',
          data: await this.getTodayMatchesByTeamId(teamId)
        }
      }

      //All matches today
      if (matchTime === 'today') {
        return {
          type: 'today',
          data: await this.getTodayMatches()
        };
      }

      //All matches tomorrow
      if (matchTime === 'tomorrow') {
        return {
          type: 'tomorrow',
          data: await this.getTomorrowMatches()
        };
      }
    } catch (e) {
      console.error(e);
    }

    return [];
  }

  public async getAllMatches() {
    let allMatches: TWinlineEvent[];

    const req = await Promise.all(
      [this.getUpcomingMatches(this.config), this.getLiveMatchesWinline(this.config)]);
    allMatches = req.flatMap((item) => (item || []));

    return allMatches;
  }

  private async getTodayMatchesByTeamId(teamId: number) {
    const allMatches = await this.getAllMatches();

    const filteredMatches = allMatches.filter(
      ({ id1, id2 }) => id1 === teamId || id2 === teamId
    );

    return this.omitWinlineData(filteredMatches);
  }

  private async getTodayMatches(): Promise<TMatch[] | []> {
    const allMatches = await this.getAllMatches();

    const filteredMatches = allMatches.filter(
      ({ datetime }) => new Date(datetime).toLocaleDateString('en-EN', { timeZone: 'Europe/Moscow' }) ===
        new Date(Date.now()).toLocaleDateString('en-EN', { timeZone: 'Europe/Moscow' })
    );
    return filteredMatches.length ? this.omitWinlineData(filteredMatches) : [];
  }

  private async getTomorrowMatches(): Promise<TMatch[] | []> {
    const tomorrowMatches = await this.getUpcomingMatches(this.config);

    if (!tomorrowMatches) return [];

    const filteredMatches = tomorrowMatches.filter(
      ({ datetime }) =>
        new Date(datetime).toLocaleDateString('en-EN', { timeZone: 'Europe/Moscow' }) >
        new Date(Date.now()).toLocaleDateString('en-EN', { timeZone: 'Europe/Moscow' })
    );

    return filteredMatches.length ? this.omitWinlineData(filteredMatches) : [];

  }

  private async getLiveMatchesWinline(config: TFilter): Promise<TWinlineEvent[] | []> {
    const winlineLiveMatches = await getWinlineLiveMatches(config);

    if (!winlineLiveMatches) return [];

    return winlineLiveMatches;
  }

  private async getUpcomingMatches(config: TFilter): Promise<TWinlineEvent[] | []> {

    const winlineAllMatches = await getWinlineAllMatches(config);

    if (!winlineAllMatches) return [];

    return winlineAllMatches;
  }

  private omitWinlineData(matches: Array<TWinlineEvent>): Array<TMatch> {
    if (!matches) {
      return [];
    }

    return matches.map(item => {
      return _.omit(item, ['TV', 'isLive', 'sport', 'country', 'betLines']);
    }).sort((a, b) => a === b ? 0 : a ? -1 : 1) as TMatch[];
  }

  public async getWinlineMatchByTeamId(teamId1: number, teamId2?: number,) {
    //allMatches: TWinlineEvent[]
  }
}