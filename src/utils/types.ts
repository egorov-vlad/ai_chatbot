import { type OpenAI } from 'openai'
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
  TV: number,
  isLive: number,
  sport: string,
  country: string,
  competition: string,
  datetime: string,
  EventUrl: string,
  team1: string,
  team2: string,
  id1: number,
  id2: number,
  odds: {
    line: TOdds[]
  } | "",
  id: string,
  isMatchLive: boolean,
  lines: TBetLine[]
}

export type TOdds = {
  freetext: string;
  value?: number;
  name1: string;
  odd1: string;
  name2: string;
  odd2: string;
  name3?: string;
  odd3?: string;
  name4?: string;
  odd4?: string;
}

export type TMatch = Omit<TWinlineEvent, 'TV' | 'isLive' | 'sport' | 'country' | 'lines'>;

export type TMatchResponse = {
  type: 'team' | 'today' | 'tomorrow',
  data: TMatch[]
}

export type TWinlineTeams = Omit<TTeam, 'id'> & {
  url: string;
}

export type TPandaScoreFilteredMatch = {
  id: number;
  datatime: string;
  status: string;
  team1: string;
  teamId1: number;
  team2: string;
  teamId2: number;
  // live: string | null;
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

export type TPandascoreFilteredTeam = {
  teamName: string;
  lastMatches: TMatchUps[],
  killAvg: number;
  gameLengthAvg: number;
  towerKillAvg: number;
  barracksKillAvg: number;
  radiantWinrate: number;
  direWinrate: number;
  firstBloodPercent: number;
  gpmAvg: number;
  mostPicked: {
    name: string;
    presence: number;
  }[];
  mostBanned: {
    name: string;
    presence: number;
  }[];
  players: string[];
}

export type TMatchUps = {
  teamName1: string;
  teamName2: string;
  score: string;
  winningTeam: string;
}

export type TAllMatchData = {
  begin_at: string;
  detailed_stats: boolean;
  encounters: {
    begin_at: string;
    detailed_stats: boolean;
    forfeit: boolean;
    games: {
      complete: boolean;
      forfeit: boolean;
      id: number;
      position: number;
    }[],
    id: number;
    league_name: string;
    modified_at: string;
    opponents: {
      acronym: string;
      id: number;
      image_url: string;
      name: string;
      score: number;
      slug: string;
      type: string
    }[],
    serie_full_name: string;
    tournament_id: number;
    tournament_name: string;
    videogame_slug: string;
    videogame_title: string;
    winner_id: number | null;
  }[],
  forfeit: boolean;
  games: {
    id: number;
    opponents: {
      heroes: {
        id: number;
        image_url: string;
        name: string;
        winrate: number;
      }[];
      id: number;
      kills: number;
      side: "dire" | "radiant";
      tower_status: {
        ancient_bottom: boolean;
        ancient_top: boolean;
        bottom_tier_1: boolean;
        bottom_tier_2: boolean;
        bottom_tier_3: boolean;
        middle_tier_1: boolean;
        middle_tier_2: boolean;
        middle_tier_3: boolean;
        top_tier_1: boolean;
        top_tier_2: boolean;
        top_tier_3: boolean;
      };
      towers: number;
    }[];
    position: number;
    status: string;
    timer: {
      issued_at: number | null;
      paused: boolean;
      timer: number | null;
    };
    radiant_gold_adv: {
      timer: number;
      value: number;
    }[];
    videogame_slug: string;
    winner_id: number | null;
  }[],
  id: number;
  league_name: string;
  match_status: string;
  modified_at: string;
  opponents: {
    acronym: string;
    form: {
      begin_at: string;
      detailed_stats: boolean;
      forfeit: boolean;
      games: {
        complete: boolean;
        forfeit: boolean;
        id: number;
        position: number;
      }[];
      id: number;
      league_name: string;
      modified_at: string;
      opponents: {
        acronym: string;
        id: number;
        image_url: string;
        name: string;
        score: number;
        slug: string;
        type: string
      }[];
      serie_full_name: string;
      tournament_id: number;
      tournament_name: string;
      videogame_slug: string;
      videogame_title: string;
      winner_id: number | null;
    }[];
    id: number;
    image_url: string;
    name: string;
    slug: string;
  }[];
  serie_full_name: string;
  streams_list: {
    embed_url: string;
    language: string;
    main: boolean;
    official: boolean;
    raw_url: string;
  }[];
  tournament_id: number;
  tournament_name: string;
  videogame_slug: string;
  videogame_title: string;
}

export type TAvgTeamData = {
  begin_at: string;
  detailed_stats: boolean;
  forfeit: boolean;
  id: number;
  league_name: string;
  modified_at: string;
  opponents: {
    acronym: string;
    id: number;
    image_url: string;
    name: string;
    number_of_games: number;
    slug: string;
    stats: {
      average_game_length: number;
      barracks: number;
      dire_winrate: number;
      first_blood_percentage: number;
      gold_per_minute: number;
      kills: number;
      most_banned_against: {
        id: number;
        image_url: string;
        name: string;
        number_of_picks: number;
        presence_percentage: number;
      }[];
      most_picked: {
        id: number;
        image_url: string;
        name: string;
        number_of_picks: number;
        presence_percentage: number;
      }[];
      players: {
        assists: number;
        camps_stacked: number;
        country: string;
        damage_percentage: number;
        deaths: number;
        gold_percentage: number;
        id: number;
        kills: number;
        last_hits: number;
        most_picked: {
          id: number;
          image_url: string;
          name: string;
          number_of_picks: number;
          presence_percentage: number;
        }[];
        name: string;
        position: string;
      }[];
      radiant_winrate: number;
      towers: number;
      xp_per_minute: number;
    };
  }[];
  serie: number | null;
  serie_full_name: string;
  tournament_id: number;
  tournament_name: string;
  videogame_slug: string;
  videogame_title: string;
}

export type TTeamMatchData = {
  teamName: string;
  worldRatingPlacement: number | null;
  lastMatches: {
    teamName1: string;
    worldRatingPlacement1: number | null;
    teamName2: string;
    worldRatingPlacement2: number | null;
    previousScore: string;
    matchResult: string;
    winningTeam: string;
  }[];
  killAvg: number;
  gameLengthAvg: string;
  towerKillAvg: number;
  barracksKillAvg: number;
  radiantWinrate: string;
  direWinrate: string;
  firstBloodPercent: string;
  gpmAvg: number;
  mostPicked: {
    name: string;
    presence: string;
  }[];
  mostBannedAgainst: {
    name: string;
    presence: string;
  }[];
  players: string[];
  playersStats: {
    name: string;
    killAvg: number;
    deathAvg: number;
    assistAvg: number;
    position: string;
    mostPickedHero: string[];
    lastHitAvg: number;
  }[];
}

export type TLiveTeamData = {
  teamName: string;
  heroes: {
    name: string;
    winRate: string;
  }[];
  side: "dire" | "radiant";
  kills: number;
  towerAlive: {
    ancient_bottom: boolean;
    ancient_top: boolean;
    bottom_tier_1: boolean;
    bottom_tier_2: boolean;
    bottom_tier_3: boolean;
    middle_tier_1: boolean;
    middle_tier_2: boolean;
    middle_tier_3: boolean;
    top_tier_1: boolean;
    top_tier_2: boolean;
    top_tier_3: boolean;
  };
  pickWinChance?: string
  towersKills: number;
}

export type TMatchData = {
  matchId: number;
  matchStatus: string;
  matchType: string;
  currentScore: string;
  liveMatch: {
    inGameTime: string;
    team1: TLiveTeamData;
    team2: TLiveTeamData;
    radiantGoldAdvantage: number | undefined;
  }[] | undefined | any;
  matchUps: {
    teamName1: string;
    teamName2: string;
    previousScore: string;
    winningTeam: string;
  }[];
  team1: TTeamMatchData;
  team2: TTeamMatchData;
};

export type TChatResponse = {
  role: string;
  message: string | OpenAI.Chat.Completions.ChatCompletionContentPart[] | null | undefined;
}

export type TChatWithTreadIDResponse = TChatResponse & {
  threadId: string;
}

export type TMessageResponse = TChatWithTreadIDResponse & { options: { isRelevant?: boolean, next?: string[] } }

export type TPredictionResponse = TChatWithTreadIDResponse & { betLines?: TBetLine[] }

export type TStratzAdvantage = {
  heroId: number;
  with: {
    heroId2: number;
    winsAverage: number;
  }[];
  vs: {
    heroId2: number;
    winsAverage: number;
  }[];
}

export type TStratzHeroStats = {
  r1: {
    advantage: TStratzAdvantage[];
  },
  r2: {
    advantage: TStratzAdvantage[];
  },
  r3: {
    advantage: TStratzAdvantage[];
  },
  r4: {
    advantage: TStratzAdvantage[];
  },
  r5: {
    advantage: TStratzAdvantage[];
  },
  d1: {
    advantage: TStratzAdvantage[];
  },
  d2: {
    advantage: TStratzAdvantage[];
  },
  d3: {
    advantage: TStratzAdvantage[];
  },
  d4: {
    advantage: TStratzAdvantage[];
  },
  d5: {
    advantage: TStratzAdvantage[];
  },
}

export type TStratzResponse = {
  heroStats: TStratzHeroStats
}

export type TPandascoreLiveMatch = {
  inGameTime: string;
  team1: TLiveTeamData;
  team2: TLiveTeamData;
  radiantGoldAdvantage: number | undefined;
}