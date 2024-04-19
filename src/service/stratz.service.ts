import redisClient from '../module/redisClient';
import { gql, GraphQLClient } from 'graphql-request';

type MatchIdList = {
  league: {
    liveMatches: [liveMatchesList] | null
  }
}

type liveMatchesList = {
  matchId: number
}

export default class StratzService {
  protected API_KEY: string
  protected API_URL: string;
  static tournamentId: number = 16483;
  private client: GraphQLClient;

  constructor() {
    this.API_KEY = process.env.STRATZ_API_KEY as string;
    this.API_URL = `https://api.stratz.com/graphql`;

    this.client = new GraphQLClient(this.API_URL, {
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
      },
    });
  }

  public async getLiveTournamentMatchesById(id: number): Promise<[liveMatchesList] | null> {
    const isLiveMatches = await redisClient.get('liveMatches');

    if (isLiveMatches && isLiveMatches.length > 2) {
      return JSON.parse(isLiveMatches);
    }

    const query = gql`{
        league(id: ${id}) {
            liveMatches {
                matchId
            }
        }
    }`;

    try {
      const liveMatchesList = await this.client.request(query) as MatchIdList;

      if (liveMatchesList.league.liveMatches && liveMatchesList.league.liveMatches.length > 0) {
        redisClient.set('liveMatches', JSON.stringify(liveMatchesList.league.liveMatches), { EX: 20 });
        return liveMatchesList.league.liveMatches;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  public async getStatsByMatchId(matchId: number): Promise<Object | null> {
    const query = gql`{
      live {
        match(id: ${matchId}) {
            matchId
            radiantScore
            direScore
            leagueId
            gameState
            gameMinute
            winRateValues
            liveWinRateValues {
                winRate
            }
            radiantTeam {
                winCount
                lossCount
                lastMatchDateTime
                name
                id
            }
            direTeam {
                winCount
                lossCount
                lastMatchDateTime
                name
                id
            }
            playbackData {
                pickBans {
                    isPick
                    heroId
                    bannedHeroId
                    isRadiant
                    baseWinRate
                    adjustedWinRate
                }
                radiantScore {
                    score
                }
                direScore {
                    score
                }
            }
            players {
                isRadiant
                numKills
                numDeaths
                numAssists
                numLastHits
                numDenies
                goldPerMinute
                experiencePerMinute
                level
                itemId0
                itemId1
                itemId2
                itemId3
                itemId4
                itemId5
                backpackId0
                backpackId1
                backpackId2
                networth
                respawnTimer
                ultimateCooldown
                ultimateState
                baseWinRateValue
                position
                hero {
                    id
                }
            }
        }
      }
    }`;

    try {
      const data = await this.client.request(query) as Object;
      return data;
    } catch (e) {
      console.error(e);
    }

    return null;
  }
}


//TODO: Сбор статистики встреч команд

//TODO: Сбор статистики игрока на герое

//TODO: Сбор статистики контрпиков

//TODO: Сбор статистики пиков

// query League {
//   league(id: 16483) {
//       liveMatches {
//           matchId
//           gameState
//           radiantTeam {
//               id
//               name
//               winCount
//               lossCount
//               lastMatchDateTime
//               matches(request: { take: 20, skip: 0 }) {
//                   didRadiantWin
//                   id
//                   radiantTeam {
//                       name
//                   }
//                   direTeam {
//                       name
//                   }
//               }
//           }
//           direTeam {
//               name
//               id
//               winCount
//               lossCount
//               lastMatchDateTime
//               matches(request: { take: 20, skip: 0 }) {
//                   didRadiantWin
//                   id
//                   radiantTeam {
//                       name
//                   }
//                   direTeam {
//                       name
//                   }
//               }
//           }
//           isParsing
//           isUpdating
//           radiantScore
//           direScore
//           gameTime
//           winRateValues
//           liveWinRateValues {
//               winRate
//           }
//       }
//       tables {
//           tableHeroes {
//               heroId
//               overview {
//                   matchWins
//                   pickPhaseOne
//                   pickPhaseTwo
//                   pickPhaseThree
//                   banCount
//                   banPhaseOne
//                   banPhaseTwo
//                   banPhaseThree
//               }
//           }
//           tableTeams {
//               team {
//                   id
//                   name
//                   winCount
//                   lossCount
//                   lastMatchDateTime
//               }
//           }
//           tablePlayers {
//               heroes {
//                   heroId
//                   matchWins
//                   matchCount
//               }
//               lanes {
//                   matchWins
//               }
//               overview {
//                   matchCount
//                   matchWins
//                   seriesWins
//                   seriesCount
//               }
//               steamAccount {
//                   realName
//               }
//           }
//       }
//       series {
//           teamOneId
//           teamTwoId
//           teamOneWinCount
//           teamTwoWinCount
//           winningTeamId
//       }
//   }
// }

