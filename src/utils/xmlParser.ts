import { XMLParser } from 'fast-xml-parser';
import type { TWinlineEvent } from './types';
import { betLines } from './constants';
import logger from '../module/logger';



export type TWinlineEventLive = TWinlineEvent & { isMatchLive: boolean }

type TWinlineMatch = {
  'Winline': {
    event: [TWinlineEvent]
  }
}

export enum GameEnum {
  DOTA_2 = 'DOTA 2',
}

export enum TournamentEnum {
  dream_league = 'DreamLeague',
  elite_league = 'Elite League',
  european_pro_league = 'European Pro League',
  esl_one = 'ESL One Birmingham',
  pgl_wallachia = 'PGL Wallachia',
  fissure_universe = "FISSURE Universe",
  riyadh_masters_qualifier = "Riyadh Masters. Qualifier",
  TI_Qualifier = "The International, Qualification",
}

export type TFilter = {
  game?: GameEnum
  tournament?: TournamentEnum

}

async function fetchWinline(url: string): Promise<string> {
  return fetch(url)
    .then((res) => res.text())
    .catch((e) => {
      logger.error(e);
      return '';
    });
}

async function parseXML(xmlDoc: string): Promise<Object | null> {
  const parser = new XMLParser({
    ignoreAttributes: false,
    transformAttributeName: (attrName) => attrName.replace(/@_/g, ''),
  });

  if (!xmlDoc) return null;

  const json = parser.parse(xmlDoc);

  return json;
}

//https://bn.wlbann.com/api/v2/cyberlive
export async function getWinlineLiveMatches(filters: TFilter): Promise<TWinlineEventLive[]> {//
  const xmlDoc = await fetchWinline('https://bn.wlbann.com/api/v2/cyberlive');
  let json = await parseXML(xmlDoc) as TWinlineMatch;

  if (!Array.isArray(json.Winline.event)) {
    json = { Winline: { event: [json.Winline.event] } }
  }

  const filteredJson = filterResponseJson(filters, json).map((match) => {
    return {
      ...match,
      betLines: betLines,
      isMatchLive: true
    }
  });

  return filteredJson;
}

//https://bn.wlbann.com/api/v2/cyberprematch
export async function getWinlineAllMatches(filters: TFilter) {
  const xmlDoc = await fetchWinline('https://bn.wlbann.com/api/v2/cyberprematch');
  const json = await parseXML(xmlDoc) as TWinlineMatch;
  // console.log(json.Winline.event);
  const filteredJson = filterResponseJson(filters, json).map((match) => {
    return {
      ...match,
      betLines: betLines,
      isMatchLive: false
    }
  });

  return filteredJson;
}

const teamFilterIds = [220624, 50033792, 220606, 371608, 678849, 50057831, 287351, 50059639, 50064178, 50006593, 50059853, 50049799, 771698, 640344, 242388, 220604, 391766, 50056001, 242386, 839880, 50032208, 50061426, 603628, 50061398];

//TODO: maybe add inner sort by date/team and etc 
export function filterResponseJson(filters: TFilter, matchList: TWinlineMatch): TWinlineEvent[] {

  let filtered: TWinlineEvent[] = [];

  // console.log(matchList);

  filtered = matchList.Winline.event.filter(item => {
    // console.log(item.competition, filters.tournament, item.competition === filters.tournament);
    if (!item) return false
    return (
      (!filters.game || item.country === filters.game) &&
      (!filters.tournament || item.competition === filters.tournament) &&
      (teamFilterIds.includes(item.id1) && teamFilterIds.includes(item.id2))
    );
  });

  // console.log(filtered);
  return filtered;
}
