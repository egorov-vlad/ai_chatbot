import _ from 'lodash';
import type { TMatch, TTeam, TWinlineEvent, TWinlineTeams } from '../utils/types';
import { teams } from '../utils/constants';


export default class TeamService {
  constructor() { }

  public getTeams(allMatches: TMatch[]): TWinlineTeams[] {  

    const uniqTeams = _.unionBy(
      Array.from(
        [...allMatches.map(team => {
          if (team) return ({ teamId: team.id1, name: team.team1, url: team.EventUrl })
        }),
        ...allMatches.map(team => {
          if (team) return ({ teamId: team.id2, name: team.team2, url: team.EventUrl })
        })]
      ), 'teamId') as TWinlineTeams[];


    return uniqTeams;
  }

  public getTeamsByWinlineMatchId(winlineMatchId: number, allMatches: TMatch[]) {

    const match = allMatches
      .filter(match => match.id === winlineMatchId.toString())[0];

    if (match) {
      const id1 = teams.find(team => team.teamId === match.id1)?.id;
      const id2 = teams.find(team => team.teamId === match.id2)?.id;

      return { id1, id2 };
    }

    return null;
  }
}