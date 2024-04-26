import { XMLParser } from 'fast-xml-parser';
//TODO: Remove fs 
import fs from 'node:fs';
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
  esl_one = 'ESL One Birmingham'
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
  const json = await parseXML(xmlDoc) as TWinlineMatch;
  const filteredJson = filterResponseJson(filters, json).map((match) => {
    return {
      ...match,
      betLines: betLines,
      isMatchLive: true
    }
  });

  fs.writeFileSync('./temp/winline-live.json', JSON.stringify(filteredJson));

  return filteredJson;
}

//https://bn.wlbann.com/api/v2/cyberprematch
export async function getWinlineAllMatches(filters: TFilter) {
  const xmlDoc = await fetchWinline('https://bn.wlbann.com/api/v2/cyberprematch');
  const json = await parseXML(xmlDoc) as TWinlineMatch;
  const filteredJson = filterResponseJson(filters, json).map((match) => {
    return {
      ...match,
      betLines: betLines,
      isMatchLive: false
    }
  });
  fs.writeFileSync('./temp/winline-filtered.json', JSON.stringify(filteredJson));

  return filteredJson;
}


//TODO: maybe add inner sort by date/team and etc 
export function filterResponseJson(filters: TFilter, matchList: TWinlineMatch): TWinlineEvent[] {

  let filtered: TWinlineEvent[] = [];

  for (const filter in filters) {
    filtered = matchList.Winline.event.filter((item) => {
      if (filter === 'game') {
        return item.country === filters[filter];
      }

      if (filter === 'tournament') {
        return item.competition === filters[filter];
      }
    });
  }


  return filtered;
}