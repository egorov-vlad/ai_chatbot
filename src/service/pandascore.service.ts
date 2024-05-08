import Bun from 'bun';
import type { TPandaScoreFilteredMatch } from '../utils/types';

export type TPandaScoreMatch = {
  tournament_id: number;
  status: string;
  videogame_version: string | null;
  rescheduled: boolean;
  videogame_title: string | null;
  forfeit: boolean;
  league: {
    id: number;
    image_url: string;
    modified_at: string;
    name: string;
    slug: string;
    url: string | null;
  };
  original_scheduled_at: string;
  id: number;
  games: {
    begin_at: string;
    complete: boolean;
    detailed_stats: boolean;
    end_at: string | null;
    finished: boolean;
    forfeit: boolean;
    id: number;
    length: number | null;
    match_id: number;
    position: number;
    status: string;
    winner: {
      id: number | null;
      type: string;
    };
    winner_type: string;
  }[];
  name: string;
  streams_list: {
    embed_url: string;
    language: string;
    main: boolean;
    official: boolean;
    raw_url: string;
  }[];
  opponents: {
    opponent: {
      acronym: string;
      id: number;
      image_url: string;
      location: string;
      modified_at: string;
      name: string;
      slug: string;
    };
    type: string;
  }[];
  slug: string;
  winner_id: number | null;
  league_id: number;
  live: {
    opens_at: string | null;
    supported: boolean;
    url: string | null;
  };
  number_of_games: number;
  serie: {
    begin_at: string;
    end_at: string;
    full_name: string;
    id: number;
    league_id: number;
    modified_at: string;
    name: string;
    season: string;
    slug: string;
    winner_id: number | null;
    winner_type: string;
    year: number;
  };
  videogame: {
    id: number;
    name: string;
    slug: string;
  };
  begin_at: string;
  modified_at: string;
  end_at: string | null;
  results: {
    score: number;
    team_id: number;
  }[];
  winner: {
    id: number | null;
    type: string;
  } | null;
  scheduled_at: string;
  tournament: {
    begin_at: string;
    detailed_stats: boolean;
    end_at: string;
    has_bracket: boolean;
    id: number;
    league_id: number;
    live_supported: boolean;
    modified_at: string;
    name: string;
    prizepool: string | null;
    serie_id: number;
    slug: string;
    tier: string;
    winner_id: number | null;
    winner_type: string;
  };
  winner_type: string;
  match_type: string;
  serie_id: number;
  draw: boolean;
  detailed_stats: boolean;
  game_advantage: string | null;
}

export class PandascoreService {
  protected API_URL: string;
  protected API_KEY: string;
  protected tournamentId: number;

  constructor() {

    this.API_URL = 'https://api.pandascore.co/dota2';
    this.API_KEY = 'Bearer ' + process.env.PANDASCORE_API_KEY;
    this.tournamentId = 4807;
  }

  private async makeRequest(route: string) {
    return fetch(this.API_URL + route, {
      headers: {
        authorization: this.API_KEY
      }
    })
      .then(res => res.json())
      .catch(err => console.error(err))
  }

  async getLiveMatches(): Promise<TPandaScoreMatch[] | []> {
    return this.makeRequest('/matches/running');
  }

  async getUpcomingMatches(): Promise<TPandaScoreMatch[] | []> {
    return this.makeRequest('/matches/upcoming');
  }

  async getAllMatches(): Promise<TPandaScoreFilteredMatch[] | []> {
    let matches: TPandaScoreFilteredMatch[] = [];
    const data = await Promise.all([
      this.getLiveMatches(), this.getUpcomingMatches()
    ]);

    data
      .flatMap((item) => (item || []))
      .filter(match => match.league_id === this.tournamentId)
      .forEach(match => {
        if (match.opponents.length < 2) return;
        matches.push({
          id: match.id,
          datatime: match.begin_at,
          status: match.status,
          team1: match.opponents[0].opponent.name,
          teamId1: match.opponents[0].opponent.id,
          team2: match.opponents[1].opponent.name,
          teamId2: match.opponents[1].opponent.id,
        });
      });

    return matches;
  }

  public async getMatchDataByID(matchID: number) {
    try {
      const res = await fetch(`https://ratchet.pandascore.co/api/matches/${matchID}/all_time?block=full`);
      const data = await res.json();

      return data;
    } catch (err) {
      console.error(matchID, err);
    }
  }

  public async getLast3MonthsMatchesByID(matchID: number) {
    try {
      const res = await fetch(`https://ratchet.pandascore.co/api/matches/${matchID}/last_3_months/period?block=full`);
      const data = await res.json();
      return data
    } catch (err) {
      console.error(err);
    }
  }

  public async getAllDataByID(matchID: number) {
    try {
      const data = await Promise.all([
        this.getMatchDataByID(matchID), this.getLast3MonthsMatchesByID(matchID)
      ]);

      return data;
    } catch (err) {
      console.error(err);
    }
  }
}