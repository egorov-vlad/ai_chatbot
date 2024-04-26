
import StratzService from './stratz.service';
import { sendMessageToGPT } from '../module/openAIClient';
import { teams } from '../utils/constants';
import type { TPredictionByTeamIds } from '../utils/types';

export default class PredictionService {
  protected stratz: StratzService;
  constructor() {
    this.stratz = new StratzService();
  }

  public async getPredictionByTeamId({ teamId, line }: TPredictionByTeamIds) {

    //TODO:Get winline matches
    // const allMatches = await this.service.getAllMatches();

    const matchList = await this.stratz.getLiveTournamentMatches();

    //TODO: If no live matches but have winline matches need to get prediction
    // only with selected line 
    if (!matchList) return null;

    const id1 = teams.find(team => team.teamId === teamId)?.id;
    const id2 = teams.find(team => team.teamId === teamId)?.id;


    const matchId =
      matchList?.league?.liveMatches?.find(match =>
        (id1 && match.radiantTeamId === id1) ||
        (id2 && match.direTeamId === id2)
      )?.matchId ??
      matchList?.league?.liveMatches?.find(match =>
        (id1 && match.radiantTeamId === id1)
      )?.matchId;


    if (!matchId) return null;

    const match = await this.stratz.getStatsByMatchId(matchId);

    //then send to gpt
    //const response = await sendMessageToGPT(message);

    //return response
  }
}