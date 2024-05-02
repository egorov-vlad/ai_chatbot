/**
 * Type of team.
 * @typedef {Object} TTeam
 * @property {number} [id] - Team id in dota2 systems  
 * @property {string} name - Team name
 * @property {number} [teamId] - Team id in in winline system 
 */

export type TTeam = {
  id: number;
  name: string;
  teamId: number;
}

export type TBetLine = {
  id: number;
  name: string;
}

export type TItems = {
  id: number;
  displayName: string | null;
}

export type TWinlineEvent = {
  'TV': number,
  'isLive': number,
  'sport': string,
  'country': string,
  'competition': string,
  'datetime': string,
  'EventUrl': string,
  'team1': string,
  'team2': string,
  'id1': number,
  'id2': number,
  'odds': string | Object,
  'id': string,
  'isMatchLive': boolean,
  lines: TBetLine[]
}

export type TMatch = Omit<TWinlineEvent, 'TV' | 'isLive' | 'sport' | 'country' | 'lines'>;

export type TMatchResponse = {
  type: 'team' | 'today' | 'tomorrow',
  data: TMatch[]
}

export type TWinlineTeams = Omit<TTeam, 'id'> & {
  url: string;
}

export type TPredictionByTeamIds = {
  teamId: number;
  line?: number;
}

export type MatchList = {
  league: {
    liveMatches: [{
      matchId: number;
      direTeamId: number;
      radiantTeamId: number;
    }] | null;
  }
}

export type TSupportTablesQuery = {
  league: {
    tables: {
      tableTeams: {
        team: {
          name: string;
        };
        overview: {
          seriesCount: number;
          seriesWins: number;
          seriesDraws: number;
        };
        stats: {
          kills: number;
          deaths: number;
          assists: number;
        };
        heroes: {
          heroId: number;
          matchCount: number;
          matchWins: number;
          banCount: number;
        }[];
        members: {
          steamAccount: {
            proSteamAccount: {
              name: string;
            };
          };
        }[];
        teamId: number;
      }[];
      tableHeroes: {
        heroId: number;
        overview: {
          matchCount: number;
          matchWins: number;
          pickPhaseOne: number;
          pickPhaseTwo: number;
          pickPhaseThree: number;
          banCount: number;
          banPhaseOne: number;
          banPhaseTwo: number;
          banPhaseThree: number;
        };
      }[];
      tablePlayers: {
        heroes: {
          heroId: number;
          matchCount: number;
          matchWins: number;
        }[];
        overview: {
          seriesCount: number;
          seriesWins: number;
          matchCount: number;
          matchWins: number;
        };
        steamAccount: {
          proSteamAccount: {
            name: string;
            team: {
              name: string;
            }
          };
        };
      }[];
    };
    series: {
      type: string;
      teamOneId: number;
      winningTeamId: number;
      matches: {
        didRadiantWin: boolean;
        radiantTeam: {
          name: string;
        }
      }[];
      teamOne: {
        name: string
      };
      teamTwo: {
        name: string
      }
    }[];
  };
};

export type THeroes = {
  id: number;
  name: string;
  aliases: string[]
}

export type TStratzTeam = {
  team: string;
  seriesCount: number;
  seriesWins: number;
  seriesDraws: number;
  killsAvg: number;
  deathsAvg: number;
  assistsAvg: number;
  heroes: {
    name?: string;
    matchCount: number;
    matchWins: number;
    banCount: number;
  }[];
  members: Array<string>;
}

export type TStratzHero = {
  name?: string;
  matchCount: number;
  matchWins: number;
  banCount: number;
  pickPhaseOne: number;
  pickPhaseTwo: number;
  pickPhaseThree: number;
  banPhaseOne: number;
  banPhaseTwo: number;
  banPhaseThree: number;
}

export type TStratzPlayer = {
  name: string;
  team: string;
  heroes: {
    name?: string;
    matchCount: number;
    matchWins: number;
  }[];
  seriesCount: number;
  seriesWins: number;
  matchCount: number;
  matchWins: number
}

// export type TStratzSeriesType = {

// }

export type TStratzSeries = {
  type: string | "BEST_OF_THREE" | "BEST_OF_FIVE" | "BEST_OF_TWO" | "BEST_OF_ONE";
  teamOneName: string;
  teamTwoName: string;
  result: "WIN" | "DRAW" | "LOSE" | "" | string;
  winningTeamName: string | null;
  matches: {
    didRadiantWin: boolean;
    radiantTeamName: string;
  }[];
}
export type TSupportTables = {
  tableTeams: TStratzTeam[];
  tableHeroes: TStratzHero[];
  tablePlayers: TStratzPlayer[]
  tableSeries: TStratzSeries[]
}

export type TStratzMatch = {
  live: {
    match: {
      radiantScore: number;
      direScore: number;
      gameTime: number;
      isUpdating: boolean;
      gameState: string;
      parseBeginGameTime: number;
      radiantTeam: {
        id: number;
        name: string;
        winCount: number;
        lossCount: number;
        series: {
          winningTeamId: number;
          type: string;
          teamOneId: number;
          teamTwoId: number;
          teamOne: {
            id: number;
            name: string;
          }
          teamTwo: {
            id: number;
            name: string;
          }
          matches: {
            didRadiantWin: boolean;
            radiantTeam: {
              name: string;
            }
          }[];
        }[];
      }
      direTeam: {
        id: number;
        name: string;
        winCount: number;
        lossCount: number;
        series: {
          winningTeamId: number;
          type: string;
          teamOneId: number;
          teamTwoId: number;
          teamOne: {
            id: number;
            name: string;
          }
          teamTwo: {
            id: number;
            name: string;
          }
          matches: {
            didRadiantWin: boolean;
            radiantTeam: {
              name: string;
            }
          }[];
        }[];
      };
      liveWinRateValues: {
        winRate: number;
      }[] | [];
      winRateValues: number[];
      insight: {
        teamOneVsWinCount: number;
        teamTwoVsWinCount: number;
        teamOneLeagueWinCount: number;
        teamOneLeagueMatchCount: number;
        teamTwoLeagueWinCount: number;
        teamTwoLeagueMatchCount: number;
        lastSeries: {
          type: string
          teamOneId: number;
          teamTwoId: number;
          winningTeamId: number;
          teamOne: {
            name: string
          }
          teamTwo: {
            name: string
          }
          matches: {
            didRadiantWin: boolean;
            radiantTeam: {
              name: string;
            }
          }[] | []
        }[]
      };
      playbackData: {
        roshanEvents: {
          time: number;
          isAlive: boolean;
          respawnTimer: number;
        }[];
        pickBans: {
          isPick: boolean;
          bannedHeroId: number | null;
          isRadiant: boolean;
          baseWinRate: number | null;
          adjustedWinRate: number | null;
          position: string | null;
          winRateValues: number[] | null;
          heroId: number | null;
        }[];
      }
      players: {
        steamAccount: {
          proSteamAccount: {
            name: string;
            team: {
              name: string;
            }
          }
        };
        heroId: number;
        isRadiant: boolean;
        numKills: number;
        numDeaths: number;
        numAssists: number;
        goldPerMinute: number;
        experiencePerMinute: number;
        networth: number;
        position: string;
        hero: {
          displayName: string;
        }
        numLastHits: number;
        level: number;
        itemId0: number;
        itemId1: number;
        itemId2: number;
        itemId3: number;
        itemId4: number;
        itemId5: number;
      }[];
    }
  }
};

export type TStratzMatchFiltered = {
  radiantScore: number;
  direScore: number;
  gameTime: number;
  radiantTeam: {
    name: string;
    winCount: number;
    loseCount: number;
    series: TStratzSeries[];
  };
  direTeam: {
    name: string;
    winCount: number;
    loseCount: number;
    series: TStratzSeries[];
  };
  liveWinRateValues: number[] | [];
  winRateValues: number[];
  insight: {
    teamOneVsWinCount: number;
    teamTwoVsWinCount: number;
    teamOneLeagueWinCount: number;
    teamOneLeagueMatchCount: number;
    teamTwoLeagueWinCount: number;
    teamTwoLeagueMatchCount: number;
    lastSeries: TStratzSeries[];
  }
  roshanEvents: {
    time: number;
    isAlive: boolean;
    respawnTimer: number;
  }[];
  picked: {
    // name?: string;
    // isRadiant: boolean;
    // baseWinRate: number | null;
    // adjustedWinRate: number | null;
    // position: string | null;
    // winRateValues: number[] | null;
  }; //[]
  banned: {
    // name?: string;
    // isRadiant: boolean;
  }; //[]
  players: {
    name: string;
    hero?: string
    team: string;
    kills: number;
    deaths: number;
    assists: number;
    lvl: number;
    item: (string | null | undefined)[];
    networth: number;
    position: string;
    numLastHits: number;
    goldPerMinute: number;
    experiencePerMinute: number;
  }[]
};

export type TStratzSliceStatistics = {
  live: {
    match: {
      gameTime: number;
      isUpdating: boolean;
      isParsing: boolean;
      gameState: string;
      parseBeginGameTime: number;
      radiantTeam: {
        name: string;
      };
      direTeam: {
        name: string;
      };
      liveWinRateValues: {
        time: number;
        winRate: number;
      }[];
      playbackData: {
        roshanEvents: {
          time: number;
          isAlive: boolean;
          respawnTimer: number;
        }[];
        radiantScore: {
          time: number;
          score: number;
        }[];
        direScore: {
          time: number;
          score: number;
        }[];
        buildingEvents: {
          time: number;
          type: string;
          isAlive: boolean;
          isRadiant: boolean;
          positionX: number;
          positionY: number;
        }[];
      }
      players: {
        steamAccount: {
          proSteamAccount: {
            name: string;
            team: {
              name: string;
            }
          }
        };
        isRadiant: boolean;
        playbackData: {
          killEvents: {
            time: number;
          }[];
          deathEvents: {
            time: number;
          }[];
          assistEvents: {
            time: number;
          }[];
          inventoryEvents: {
            time: number;
            itemId0: number;
            itemId1: number;
            itemId2: number;
            itemId3: number;
            itemId4: number;
            itemId5: number;
            backpackId0: number;
            backpackId1: number;
            backpackId2: number;
          }[];
          goldEvents: {
            networth: number;
            networthDifference: number;
            time: number;
          }[];
          levelEvents: {
            time: number;
            level: number;
          }[];
        }
      }[];
    }
  }
}