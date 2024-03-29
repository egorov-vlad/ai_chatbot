import { XMLParser } from "fast-xml-parser";
//TODO: Remove fs 
import fs from 'node:fs';


type TWinlineEvent = {
  "TV": number,
  "isLive": number,
  "sport": string,
  "country": string,
  "competition": string,
  "datetime": string,
  "EventUrl": string,
  "team1": string,
  "team2": string,
  "id1": number,
  "id2": number,
  "odds": string | Object
}

type TWinlineMatch = {
  "Winline": {
    event: [TWinlineEvent]
  }
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
  });

  if (!xmlDoc) return null;

  const json = parser.parse(xmlDoc);

  return json;
}

//https://bn.wlbann.com/api/v2/cyberlive
export async function getWinlineLiveMatches() {
  const xmlDoc = await fetchWinline('https://bn.wlbann.com/api/v2/cyberlive');
  const json = await parseXML(xmlDoc);

  fs.writeFileSync('./temp/winline.json', JSON.stringify(json));

  return json;
}

//https://bn.wlbann.com/api/v2/cyberprematch
export async function getWinlineAllMatches() {
  const xmlDoc = await fetchWinline('https://bn.wlbann.com/api/v2/cyberprematch');
  const json = await parseXML(xmlDoc) as TWinlineMatch;
  const filteredJson = filterByGame('DOTA 2', json);
  fs.writeFileSync('./temp/winline-filtered.json', JSON.stringify(filteredJson));

  return json;
}


//TODO: maybe add inner sort by date/team and etc 
export function filterByGame(game: string, data: TWinlineMatch): TWinlineEvent[] {
  return data.Winline.event.filter((item) => item.country === game);
}

getWinlineAllMatches()