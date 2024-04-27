import redisClient from '../module/redisClient';
import { gql, GraphQLClient } from 'graphql-request';
import type { MatchList, TStratzHero, TStratzMatch, TStratzMatchFiltered, TStratzPlayer, TStratzSeries, TStratzTeam, TSupportTables, TSupportTablesQuery } from '../utils/types';
import { heroes, teams, items } from '../utils/constants';



type liveMatchesList = {
  matchId: number;
  radiantTeam: {
    id: number;
    name: string;
  };
  direTeam: {
    id: number;
    name: string;
  };
}

export default class StratzService {
  protected API_KEY: string
  protected API_URL: string;
  protected tournamentId: number;
  private client: GraphQLClient;

  constructor() {
    this.API_KEY = process.env.STRATZ_API_KEY as string;
    this.API_URL = `https://api.stratz.com/graphql`;

    this.tournamentId = 16518;

    this.client = new GraphQLClient(this.API_URL, {
      headers: {
        Authorization: `Bearer ${this.API_KEY}`,
      },
    });
  }

  private async makeRequest(query: string) {
    try {
      const data = this.client.request(query);
      return data;
    } catch (err) {
      console.error(err)
    }
  }

  public async getLiveTournamentMatches(): Promise<MatchList | null> {
    const query = gql`{
      league(id: ${this.tournamentId}) {
          liveMatches {
              matchId
              direTeamId
              radiantTeamId
          }
      }
    }`;

    try {
      const liveMatchesList = await this.makeRequest(query) as MatchList;
      return liveMatchesList;
    } catch (err) {
      console.error(err)
    }
    return null;
  }

  public async getSupportTables() {
    const query = gql`{
      league(id: ${this.tournamentId}) {
          tables(calculateTypeId: MEDIAN) {
              tableTeams {
                  team {
                      name
                  }
                  overview {
                      seriesCount
                      seriesWins
                      seriesDraws
                  }
                  stats {
                      kills
                      deaths
                      assists
                  }
                  heroes {
                      heroId
                      matchCount
                      matchWins
                      banCount
                  }
                  members {
                      steamAccount {
                          proSteamAccount {
                              name
                          }
                      }
                  }
                  teamId
              }
              tableHeroes {
                  heroId
                  overview {
                      matchCount
                      matchWins
                      pickPhaseOne
                      pickPhaseTwo
                      pickPhaseThree
                      banCount
                      banPhaseOne
                      banPhaseTwo
                      banPhaseThree
                  }
              }
              tablePlayers {
                  heroes {
                      heroId
                      matchCount
                      matchWins
                  }
                  overview {
                      seriesCount
                      seriesWins
                      matchCount
                      matchWins
                  }
                  steamAccount {
                      proSteamAccount {
                          name
                          team {
                            name
                          }
                      }
                  }
              }
          }
          series(take: 100) {
              type
              teamOneId
              winningTeamId
              matches {
                  didRadiantWin
                  radiantTeam{
                    name
                  }
              }
              teamOne {
                  name
              }
              teamTwo {
                name
              }
          }
      }
  }`;

    try {
      const supportTables = await this.makeRequest(query) as TSupportTablesQuery;

      return this.deserializeSupportTables(supportTables);
    } catch (err) {
      console.error(err)
    }
  }

  public async getStatsByMatchId(matchId: number): Promise<TStratzMatchFiltered | null> {
    const query = gql`{
      live {
          match(id: ${matchId}) {
              radiantScore
              direScore
              gameTime
              isUpdating
              radiantTeam {
                  id
                  name
                  winCount
                  lossCount
                  series(request: { take: 20 }) {
                      winningTeamId
                      type
                      teamOneId
                      teamTwoId
                      teamOne {
                          id
                          name
                      }
                      teamTwo {
                          id
                          name
                      }
                      matches {
                          didRadiantWin
                          radiantTeam {
                              name
                          }
                      }
                  }
              }
              direTeam {
                  id
                  name
                  winCount
                  lossCount
                  series(request: { take: 20 }) {
                      winningTeamId
                      type
                      teamOneId
                      teamTwoId
                      teamOne {
                          id
                          name
                      }
                      teamTwo {
                          id
                          name
                      }
                      matches {
                          didRadiantWin
                          radiantTeam {
                              name
                          }
                      }
                  }
              }
              liveWinRateValues {
                  winRate
              }
              winRateValues
              insight {
                  teamOneVsWinCount
                  teamTwoVsWinCount
                  teamOneLeagueWinCount
                  teamOneLeagueMatchCount
                  teamTwoLeagueWinCount
                  teamTwoLeagueMatchCount
                  lastSeries {
                      type
                      teamOneId
                      teamTwoId
                      winningTeamId
                      teamOne {
                          name
                      }
                      teamTwo {
                          name
                      }
                      matches {
                          didRadiantWin
                          radiantTeam {
                              name
                          }
                      }
                  }
              }
              playbackData {
                  roshanEvents {
                      time
                      isAlive
                      respawnTimer
                  }
                  pickBans {
                      isPick
                      bannedHeroId
                      isRadiant
                      baseWinRate
                      adjustedWinRate
                      position
                      winRateValues
                      heroId
                  }
              }
              players {
                  steamAccount {
                      proSteamAccount {
                          name
                          team {
                              name
                          }
                      }
                  }
                  isRadiant
                  numKills
                  numDeaths
                  numAssists
                  goldPerMinute
                  networth
                  position
                  hero {
                      displayName
                  }
                  numLastHits
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
                  experiencePerMinute
              }
              gameState
              parseBeginGameTime
          }
      }
  }`;

    try {
      const data = await this.makeRequest(query) as TStratzMatch;
      // return this.deserializeMatchStatistics(data);
      return null
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  public async getPlaybackStatsByMatchId(matchId: number) {
    const query = gql`{
      live {
          match(id: ${matchId}) {
              gameTime
              isUpdating
              gameState
              parseBeginGameTime
              isParsing
              radiantTeam {
                  name
              }
              direTeam {
                  name
              }
              liveWinRateValues {
                  time
                  winRate
              }
              playbackData {
                  roshanEvents {
                      time
                      isAlive
                      respawnTimer
                  }
                  radiantScore {
                      time
                      score
                  }
                  direScore {
                      time
                      score
                  }
                  buildingEvents {
                      time
                      type
                      isAlive
                      isRadiant
                      positionX
                      positionY
                  }
              }
              players {
                  steamAccount {
                      proSteamAccount {
                          name
                          team {
                              name
                          }
                      }
                  }
                  isRadiant
                  playbackData {
                      killEvents {
                          time
                      }
                      deathEvents {
                          time
                      }
                      assistEvents {
                          time
                      }
                      inventoryEvents {
                          time
                          itemId0
                          itemId1
                          itemId2
                          itemId3
                          itemId4
                          itemId5
                          backpackId0
                          backpackId1
                          backpackId2
                      }
                      goldEvents {
                          networth
                          networthDifference
                          time
                      }
                      levelEvents {
                          time
                          level
                      }
                  }
              }
          }
      }
  }`;

    try {
      const data = await this.makeRequest(query);
      return this.sliceMatchStat(data);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  private deserializeSupportTables(tables: TSupportTablesQuery): TSupportTables {
    const tableTeams: TStratzTeam[] = tables.league.tables.tableTeams.map(team => {
      return {
        team: team.team.name,
        seriesCount: team.overview.seriesCount,
        seriesWins: team.overview.seriesWins,
        seriesDraws: team.overview.seriesDraws,
        killsAvg: Number(team.stats.kills.toFixed(2)),
        deathsAvg: Number(team.stats.deaths.toFixed(2)),
        assistsAvg: Number(team.stats.assists.toFixed(2)),
        heroes: team.heroes.map(hero => {
          return {
            name: heroes.find(constHero => constHero?.id === hero.heroId)?.name,
            matchCount: hero.matchCount,
            matchWins: hero.matchWins,
            banCount: hero.banCount
          }
        }),
        members: team.members.map(member => {
          return member.steamAccount.proSteamAccount.name

        }),
      };
    });

    const tableHeroes: TStratzHero[] = tables.league.tables.tableHeroes.map(hero => {
      return {
        name: heroes.find(constHero => constHero?.id === hero.heroId)?.name,
        matchCount: hero.overview.matchCount,
        matchWins: hero.overview.matchWins,
        banCount: hero.overview.banCount,
        pickPhaseOne: hero.overview.pickPhaseOne,
        pickPhaseTwo: hero.overview.pickPhaseTwo,
        pickPhaseThree: hero.overview.pickPhaseThree,
        banPhaseOne: hero.overview.banPhaseOne,
        banPhaseTwo: hero.overview.banPhaseTwo,
        banPhaseThree: hero.overview.banPhaseThree
      }
    })

    const tablePlayers: TStratzPlayer[] = tables.league.tables.tablePlayers.map(player => {
      return {
        name: player.steamAccount.proSteamAccount.name,
        team: player.steamAccount.proSteamAccount.team.name,
        heroes: player.heroes.map(hero => {
          return {
            name: heroes.find(constHero => constHero?.id === hero.heroId)?.name,
            matchCount: hero.matchCount,
            matchWins: hero.matchWins,
          }
        }),
        seriesCount: player.overview.seriesCount,
        seriesWins: player.overview.seriesWins,
        matchCount: player.overview.matchCount,
        matchWins: player.overview.matchWins
      }
    })

    const tableSeries: TStratzSeries[] = tables.league.series.map(series => {
      return {
        type: series.type,
        teamOneName: series.teamOne.name,
        teamTwoName: series.teamTwo.name,
        winningTeamName: series.winningTeamId !== null ?
          series.winningTeamId === series.teamOneId ? series.teamOne.name : series.teamTwo.name : null,
        result: this.getMatchResult(series.type, series.winningTeamId, series.teamOneId),
        matches: series.matches.map(match => {
          return {
            didRadiantWin: match.didRadiantWin,
            radiantTeamName: match.radiantTeam.name,
          }
        })
      }
    })

    return {
      tableTeams, tableHeroes, tablePlayers, tableSeries
    }
  }

  // private deserializeMatchStatistics(match: TStratzMatch): TStratzMatchFiltered {
  //   return {
  //     radiantScore: match.live.match.radiantScore,
  //     direScore: match.live.match.direScore,
  //     gameTime: match.live.match.gameTime,
  //     radiantTeam: {
  //       name: match.live.match.radiantTeam.name,
  //       winCount: match.live.match.radiantTeam.winCount,
  //       loseCount: match.live.match.radiantTeam.lossCount,
  //       series: match.live.match.radiantTeam.series.map(series => {
  //         return {
  //           type: series.type,
  //           teamOneName: series.teamOne.name,
  //           teamTwoName: series.teamTwo.name,
  //           result: series.winningTeamId === null ? "DRAW" : series.winningTeamId === series.teamOneId ? "WIN" : "LOSE",
  //           matches: series.matches.map(match => {
  //             return {
  //               didRadiantWin: match.didRadiantWin,
  //               radiantTeamName: match.radiantTeam.name,
  //             }
  //           })
  //         }
  //       })
  //     },
  //     direTeam: {
  //       name: match.live.match.direTeam.name,
  //       winCount: match.live.match.direTeam.winCount,
  //       loseCount: match.live.match.direTeam.lossCount,
  //       series: match.live.match.direTeam.series.map(series => {
  //         return {
  //           type: series.type,
  //           teamOneName: series.teamOne.name,
  //           teamTwoName: series.teamTwo.name,
  //           result: this.getMatchResult(series.type, series.winningTeamId, match.live.match.direTeam.id),
  //           matches: series.matches.map(match => {
  //             return {
  //               didRadiantWin: match.didRadiantWin,
  //               radiantTeamName: match.radiantTeam.name,
  //             }
  //           })
  //         }
  //       })
  //     },
  //     liveWinRateValues: match.live.match.liveWinRateValues.map(value => {
  //       return value.winRate
  //     }),
  //     winRateValues: match.live.match.winRateValues,
  //     insight: {
  //       teamOneVsWinCount: match.live.match.insight.teamOneVsWinCount,
  //       teamTwoVsWinCount: match.live.match.insight.teamTwoVsWinCount,
  //       teamOneLeagueWinCount: match.live.match.insight.teamOneLeagueWinCount,
  //       teamTwoLeagueWinCount: match.live.match.insight.teamTwoLeagueWinCount,
  //       teamOneLeagueMatchCount: match.live.match.insight.teamOneLeagueMatchCount,
  //       teamTwoLeagueMatchCount: match.live.match.insight.teamTwoLeagueMatchCount,
  //       lastSeries: match.live.match.insight.lastSeries.map(series => {
  //         return {
  //           type: series.type,
  //           teamOneName: series.teamOne.name,
  //           teamTwoName: series.teamTwo.name,
  //           result: this.getMatchResult(series.type, series.winningTeamId, series.teamOneId),
  //           matches: series.matches.map(match => {
  //             return {
  //               didRadiantWin: match.didRadiantWin,
  //               radiantTeamName: match.radiantTeam.name,
  //             }
  //           })
  //         }
  //       })
  //     },
  //     roshanEvents: match.live.match.playbackData.roshanEvents,
  //     picked: match.live.match.playbackData.pickBans.map(pickBan => {
  //       if (pickBan.isPick) {
  //         return {
  //           name: heroes.find(hero => hero?.id === pickBan.heroId)?.name,
  //           isRadiant: pickBan.isRadiant,
  //           baseWinRate: pickBan.baseWinRate,
  //           adjustedWinRate: pickBan.adjustedWinRate,
  //           position: pickBan.position,
  //           winRateValues: pickBan.winRateValues
  //         }
  //       }
  //     }).filter(item => item !== undefined),
  //     banned: match.live.match.playbackData.pickBans.map(pickBan => {
  //       if (!pickBan.isPick) {
  //         return {
  //           name: heroes.find(hero => hero?.id === pickBan.bannedHeroId)?.name,
  //           isRadiant: pickBan.isRadiant,
  //         }
  //       }
  //     }).filter(item => item !== undefined),
  //     players: match.live.match.players.map(player => {
  //       return {
  //         name: player.steamAccount.proSteamAccount.name,
  //         hero: heroes.find(hero => hero?.id === player.heroId)?.name,
  //         team: player.isRadiant ? match.live.match.radiantTeam.name : match.live.match.direTeam.name,
  //         kills: player.numKills,
  //         deaths: player.numDeaths,
  //         assists: player.numAssists,
  //         lvl: player.level,
  //         item: this.getItemNameById([player.itemId0, player.itemId1, player.itemId2, player.itemId3, player.itemId4, player.itemId5]),
  //         networth: player.networth,
  //         position: player.position,
  //         numLastHits: player.numLastHits,
  //         goldPerMinute: player.goldPerMinute,
  //         experiencePerMinute: player.experiencePerMinute
  //       }
  //     })
  //   }
  // }

  private getMatchResult(type: string, winningTeamId: number, myId: number) {
    if (type === "BEST_OF_ONE" || type === "BEST_OF_THREE" || type === "BEST_OF_FIVE") {
      if (winningTeamId === null) {
        return "";
      }

      return winningTeamId === myId ? "WIN" : "LOSE";
    }

    if (type === "BEST_OF_TWO") {
      return winningTeamId === null ? "DRAW" : winningTeamId === myId ? "WIN" : "LOSE";
    }

    return "";
  }

  private sliceMatchStat(data: any) {

    const timeSliceSec = 30;
    const lastTimeSliceSec = 0;




  }

  private getItemNameById(ids: number[]) {
    return ids.map(id => {
      return items.find(item => item?.id === id)?.displayName;
    })
  }
}



//TODO: Сбор статистики встреч команд

//TODO: Сбор статистики игрока на герое

//TODO: Сбор статистики контрпиков

//TODO: Сбор статистики пиков

