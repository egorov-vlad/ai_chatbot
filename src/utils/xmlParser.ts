import { XMLParser } from 'fast-xml-parser';
import type { TWinlineEvent } from './types';
import { betLines } from './constants';



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
  dream_league = 'DreamLeague Season 23',
  elite_league = 'Elite League',
  european_pro_league = 'European Pro League',
  esl_one = 'ESL One Birmingham',
  pgl_wallachia = 'PGL Wallachia'
}

export type TFilter = {
  game?: GameEnum
  tournament?: TournamentEnum

}

async function fetchWinline(url: string): Promise<string> {
  return fetch(url)
    .then((res) => res.text())
    .catch((e) => {
      console.error(e);
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


//TODO: maybe add inner sort by date/team and etc 
export function filterResponseJson(filters: TFilter, matchList: TWinlineMatch): TWinlineEvent[] {

  let filtered: TWinlineEvent[] = [];

  // console.log(matchList);

  filtered = matchList.Winline.event.filter(item => {
    // console.log(item.competition, filters.tournament, item.competition === filters.tournament);
    return (
      (!filters.game || item.country === filters.game) &&
      (!filters.tournament || item.competition === filters.tournament)
    );
  });

  // console.log(filtered);
  return filtered;
}