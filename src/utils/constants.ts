import type { TTeam, TBetLine, THeroes, TItems } from './types';

/**
 * Type of team.
 * @property {number} [id] - Team id in dota2 systems  
 * @property {string} name - Team name
 * @property {number} [teamId] - Team id in in winline system 
 */
export const teams: TTeam[] = [{
  id: 8255888,
  name: 'BetBoom Team',
  teamId: 50031026
}, {
  id: 8261500,
  name: 'Xtreme Gaming',
  teamId: 769808
}, {
  id: 8599101,
  name: 'Gaimin Gladiators',
  teamId: 881559
}, {
  id: 9247354,
  name: 'Team Falcons',
  teamId: 883309
}, {
  id: 2163,
  name: 'Team Liquid',
  teamId: 281541
}, {
  id: 8291895,
  name: 'Tundra Esports',
  teamId: 771698
}, {
  id: 36,
  name: 'Natus Vincere',
  teamId: 0 //TODO: Add valid teamId
}, {
  id: 8894818,
  name: 'PSG Quest',
  teamId: 50056001
}, {
  id: 8574561,
  name: 'Azure Ray',
  teamId: 50049400
}, {
  id: 9255706,
  name: 'Aurora',
  teamId: 50046800,
}, {
  id: 39,
  name: 'Shopify Rebellion',
  teamId: 50044347
}, {
  id: 9303484,
  name: 'HEROIC',
  teamId: 282171
}];


export const betLines: TBetLine[] = [
  {
    id: 1,
    name: "Победа 1 х 2 матч"
  },
  {
    id: 2,
    name: "Точный счет по картам"
  },
  {
    id: 3,
    name: "Тотал убийств матч"
  },
  {
    id: 4,
    name: "Фора убийств матч"
  },
  {
    id: 5,
    name: "Кто уничтожит больше башен матч"
  },
  {
    id: 6,
    name: "Выиграет хотя бы одну карту"
  },
  {
    id: 7,
    name: "Rто сделает больше убийств матч"
  }
];


export const heroes: THeroes[] = [
  {
    "id": 1,
    "name": "Anti-Mage",
    "aliases": [
      "am",
      "wei"
    ]
  },
  {
    "id": 2,
    "name": "Axe",
    "aliases": []
  },
  {
    "id": 3,
    "name": "Bane",
    "aliases": []
  },
  {
    "id": 4,
    "name": "Bloodseeker",
    "aliases": [
      "bs"
    ]
  },
  {
    "id": 5,
    "name": "Crystal Maiden",
    "aliases": [
      "cm",
      "rylai",
      "wolf"
    ]
  },
  {
    "id": 6,
    "name": "Drow Ranger",
    "aliases": [
      "Traxex"
    ]
  },
  {
    "id": 7,
    "name": "Earthshaker",
    "aliases": [
      "es",
      "Raigor"
    ]
  },
  {
    "id": 8,
    "name": "Juggernaut",
    "aliases": [
      "Yurnero"
    ]
  },
  {
    "id": 9,
    "name": "Mirana",
    "aliases": [
      "Princess",
      "Moon",
      "potm"
    ]
  },
  {
    "id": 10,
    "name": "Morphling",
    "aliases": []
  },
  {
    "id": 11,
    "name": "Shadow Fiend",
    "aliases": [
      "sf",
      "nevermore"
    ]
  },
  {
    "id": 12,
    "name": "Phantom Lancer",
    "aliases": [
      "pl",
      "Azwraith"
    ]
  },
  {
    "id": 13,
    "name": "Puck",
    "aliases": [
      "Faerie Dragon",
      "fd"
    ]
  },
  {
    "id": 14,
    "name": "Pudge",
    "aliases": [
      "Toy Butcher"
    ]
  },
  {
    "id": 15,
    "name": "Razor",
    "aliases": [
      "Lightning Revenant"
    ]
  },
  {
    "id": 16,
    "name": "Sand King",
    "aliases": [
      "sk",
      "Crixalis"
    ]
  },
  {
    "id": 17,
    "name": "Storm Spirit",
    "aliases": [
      "ss",
      "raijin",
      "thunderkeg"
    ]
  },
  {
    "id": 18,
    "name": "Sven",
    "aliases": [
      "Rogue Knight"
    ]
  },
  {
    "id": 19,
    "name": "Tiny",
    "aliases": [
      "Stone Giant"
    ]
  },
  {
    "id": 20,
    "name": "Vengeful Spirit",
    "aliases": [
      "vs",
      "Shendelzare"
    ]
  },
  {
    "id": 21,
    "name": "Windranger",
    "aliases": [
      "wr",
      "Lyralei"
    ]
  },
  {
    "id": 22,
    "name": "Zeus",
    "aliases": [
      "Lord of Heaven"
    ]
  },
  {
    "id": 23,
    "name": "Kunkka",
    "aliases": [
      "Admiral"
    ]
  },
  {
    "id": 25,
    "name": "Lina",
    "aliases": [
      "slayer"
    ]
  },
  {
    "id": 26,
    "name": "Lion",
    "aliases": [
      "Demon Witch"
    ]
  },
  {
    "id": 27,
    "name": "Shadow Shaman",
    "aliases": [
      "ss",
      "Rhasta"
    ]
  },
  {
    "id": 28,
    "name": "Slardar",
    "aliases": [
      "Slithereen Guard"
    ]
  },
  {
    "id": 29,
    "name": "Tidehunter",
    "aliases": [
      "th",
      "Leviathan"
    ]
  },
  {
    "id": 30,
    "name": "Witch Doctor",
    "aliases": [
      "wd",
      "Zharvakko"
    ]
  },
  {
    "id": 31,
    "name": "Lich",
    "aliases": [
      "Ethreain"
    ]
  },
  {
    "id": 32,
    "name": "Riki",
    "aliases": [
      "Stealth Assassin",
      "sa"
    ]
  },
  {
    "id": 33,
    "name": "Enigma",
    "aliases": []
  },
  {
    "id": 34,
    "name": "Tinker",
    "aliases": [
      "Boush"
    ]
  },
  {
    "id": 35,
    "name": "Sniper",
    "aliases": [
      "Kardel Sharpeye"
    ]
  },
  {
    "id": 36,
    "name": "Necrophos",
    "aliases": [
      "Rotundjere"
    ]
  },
  {
    "id": 37,
    "name": "Warlock",
    "aliases": [
      "wl",
      "Demnok Lannik"
    ]
  },
  {
    "id": 38,
    "name": "Beastmaster",
    "aliases": [
      "bm"
    ]
  },
  {
    "id": 39,
    "name": "Queen of Pain",
    "aliases": [
      "qop",
      "Akasha"
    ]
  },
  {
    "id": 40,
    "name": "Venomancer",
    "aliases": [
      "Lesale"
    ]
  },
  {
    "id": 41,
    "name": "Faceless Void",
    "aliases": [
      "fv"
    ]
  },
  {
    "id": 42,
    "name": "Wraith King",
    "aliases": [
      "sk",
      "snk",
      "wk",
      "skeleton",
      "one true king",
      "Ostarion"
    ]
  },
  {
    "id": 43,
    "name": "Death Prophet",
    "aliases": [
      "dp",
      "Krobelus"
    ]
  },
  {
    "id": 44,
    "name": "Phantom Assassin",
    "aliases": [
      "pa",
      "mortred"
    ]
  },
  {
    "id": 45,
    "name": "Pugna",
    "aliases": []
  },
  {
    "id": 46,
    "name": "Templar Assassin",
    "aliases": [
      "ta",
      "Lanaya"
    ]
  },
  {
    "id": 47,
    "name": "Viper",
    "aliases": [
      "Netherdrake"
    ]
  },
  {
    "id": 48,
    "name": "Luna",
    "aliases": [
      "Moon Rider"
    ]
  },
  {
    "id": 49,
    "name": "Dragon Knight",
    "aliases": [
      "dk",
      "davion",
      "dragon's blood"
    ]
  },
  {
    "id": 50,
    "name": "Dazzle",
    "aliases": []
  },
  {
    "id": 51,
    "name": "Clockwerk",
    "aliases": [
      "Rattletrap",
      "cw"
    ]
  },
  {
    "id": 52,
    "name": "Leshrac",
    "aliases": [
      "ts"
    ]
  },
  {
    "id": 53,
    "name": "Nature's Prophet",
    "aliases": [
      "np"
    ]
  },
  {
    "id": 54,
    "name": "Lifestealer",
    "aliases": [
      "ls",
      "Naix"
    ]
  },
  {
    "id": 55,
    "name": "Dark Seer",
    "aliases": [
      "ds",
      "Ishkafel"
    ]
  },
  {
    "id": 56,
    "name": "Clinkz",
    "aliases": []
  },
  {
    "id": 57,
    "name": "Omniknight",
    "aliases": [
      "Purist Thunderwrath"
    ]
  },
  {
    "id": 58,
    "name": "Enchantress",
    "aliases": [
      "Aiushtha"
    ]
  },
  {
    "id": 59,
    "name": "Huskar",
    "aliases": []
  },
  {
    "id": 60,
    "name": "Night Stalker",
    "aliases": [
      "ns",
      "Balanar"
    ]
  },
  {
    "id": 61,
    "name": "Broodmother",
    "aliases": [
      "bm",
      "Arachnia"
    ]
  },
  {
    "id": 62,
    "name": "Bounty Hunter",
    "aliases": [
      "bh"
    ]
  },
  {
    "id": 63,
    "name": "Weaver",
    "aliases": [
      "nw",
      "Skitskurr"
    ]
  },
  {
    "id": 64,
    "name": "Jakiro",
    "aliases": [
      "thd",
      "twin headed dragon"
    ]
  },
  {
    "id": 65,
    "name": "Batrider",
    "aliases": [
      "br"
    ]
  },
  {
    "id": 66,
    "name": "Chen",
    "aliases": [
      "Holy Knight"
    ]
  },
  {
    "id": 67,
    "name": "Spectre",
    "aliases": [
      "Mercurial"
    ]
  },
  {
    "id": 68,
    "name": "Ancient Apparition",
    "aliases": [
      "aa"
    ]
  },
  {
    "id": 69,
    "name": "Doom",
    "aliases": [
      "db"
    ]
  },
  {
    "id": 70,
    "name": "Ursa",
    "aliases": [
      "Ulfsaar"
    ]
  },
  {
    "id": 71,
    "name": "Spirit Breaker",
    "aliases": [
      "sb",
      "Barathrum"
    ]
  },
  {
    "id": 72,
    "name": "Gyrocopter",
    "aliases": [
      "Aurel"
    ]
  },
  {
    "id": 73,
    "name": "Alchemist",
    "aliases": [
      "Razzil"
    ]
  },
  {
    "id": 74,
    "name": "Invoker",
    "aliases": [
      "kid"
    ]
  },
  {
    "id": 75,
    "name": "Silencer",
    "aliases": [
      "Nortrom"
    ]
  },
  {
    "id": 76,
    "name": "Outworld Destroyer",
    "aliases": [
      "od",
      "Harbinger"
    ]
  },
  {
    "id": 77,
    "name": "Lycan",
    "aliases": [
      "Banehallow",
      "wolf"
    ]
  },
  {
    "id": 78,
    "name": "Brewmaster",
    "aliases": [
      "bm",
      "Mangix"
    ]
  },
  {
    "id": 79,
    "name": "Shadow Demon",
    "aliases": [
      "sd"
    ]
  },
  {
    "id": 80,
    "name": "Lone Druid",
    "aliases": [
      "ld",
      "bear",
      "Sylla"
    ]
  },
  {
    "id": 81,
    "name": "Chaos Knight",
    "aliases": [
      "ck"
    ]
  },
  {
    "id": 82,
    "name": "Meepo",
    "aliases": [
      "geomancer",
      "meepwn"
    ]
  },
  {
    "id": 83,
    "name": "Treant Protector",
    "aliases": []
  },
  {
    "id": 84,
    "name": "Ogre Magi",
    "aliases": [
      "om"
    ]
  },
  {
    "id": 85,
    "name": "Undying",
    "aliases": [
      "Dirge"
    ]
  },
  {
    "id": 86,
    "name": "Rubick",
    "aliases": [
      "rubick"
    ]
  },
  {
    "id": 87,
    "name": "Disruptor",
    "aliases": [
      "disruptor"
    ]
  },
  {
    "id": 88,
    "name": "Nyx Assassin",
    "aliases": [
      "na"
    ]
  },
  {
    "id": 89,
    "name": "Naga Siren",
    "aliases": [
      "naga",
      "Slithice"
    ]
  },
  {
    "id": 90,
    "name": "Keeper of the Light",
    "aliases": [
      "keeper",
      "ezalor",
      "kotl"
    ]
  },
  {
    "id": 91,
    "name": "Io",
    "aliases": [
      "wisp"
    ]
  },
  {
    "id": 92,
    "name": "Visage",
    "aliases": [
      "visage",
      "Necrolic"
    ]
  },
  {
    "id": 93,
    "name": "Slark",
    "aliases": [
      "slark"
    ]
  },
  {
    "id": 94,
    "name": "Medusa",
    "aliases": [
      "medusa",
      "gorgon"
    ]
  },
  {
    "id": 95,
    "name": "Troll Warlord",
    "aliases": [
      "troll",
      "jahrakal"
    ]
  },
  {
    "id": 96,
    "name": "Centaur Warrunner",
    "aliases": [
      "centaur"
    ]
  },
  {
    "id": 97,
    "name": "Magnus",
    "aliases": [
      "magnataur",
      "magnus"
    ]
  },
  {
    "id": 98,
    "name": "Timbersaw",
    "aliases": [
      "Rizzrack",
      "Shredder",
      "Timbersaw"
    ]
  },
  {
    "id": 99,
    "name": "Bristleback",
    "aliases": [
      "Rigwarl",
      "bb"
    ]
  },
  {
    "id": 100,
    "name": "Tusk",
    "aliases": [
      "Ymir"
    ]
  },
  {
    "id": 101,
    "name": "Skywrath Mage",
    "aliases": [
      "sm",
      "Dragonus"
    ]
  },
  {
    "id": 102,
    "name": "Abaddon",
    "aliases": [
      "Abaddon"
    ]
  },
  {
    "id": 103,
    "name": "Elder Titan",
    "aliases": [
      "TC",
      "Cairne",
      "et"
    ]
  },
  {
    "id": 104,
    "name": "Legion Commander",
    "aliases": [
      "Tresdin",
      "Legion",
      "lc"
    ]
  },
  {
    "id": 105,
    "name": "Techies",
    "aliases": [
      "Squee",
      "Spleen",
      "Spoon"
    ]
  },
  {
    "id": 106,
    "name": "Ember Spirit",
    "aliases": [
      "Xin",
      "Ember",
      "es"
    ]
  },
  {
    "id": 107,
    "name": "Earth Spirit",
    "aliases": [
      "es",
      "Kaolin",
      "Earth"
    ]
  },
  {
    "id": 108,
    "name": "Underlord",
    "aliases": [
      "PitLord",
      "Azgalor",
      "ul"
    ]
  },
  {
    "id": 109,
    "name": "Terrorblade",
    "aliases": [
      "tb"
    ]
  },
  {
    "id": 110,
    "name": "Phoenix",
    "aliases": [
      "ph"
    ]
  },
  {
    "id": 111,
    "name": "Oracle",
    "aliases": [
      "ora",
      "Nerif"
    ]
  },
  {
    "id": 112,
    "name": "Winter Wyvern",
    "aliases": [
      "ww",
      "Auroth"
    ]
  },
  {
    "id": 113,
    "name": "Arc Warden",
    "aliases": [
      "zet",
      "aw"
    ]
  },
  {
    "id": 114,
    "name": "Monkey King",
    "aliases": [
      "mk",
      "Sun Wukong"
    ]
  },
  {
    "id": 119,
    "name": "Dark Willow",
    "aliases": [
      "dw",
      "Mireska"
    ]
  },
  {
    "id": 120,
    "name": "Pangolier",
    "aliases": [
      "ar"
    ]
  },
  {
    "id": 121,
    "name": "Grimstroke",
    "aliases": [
      "gs"
    ]
  },
  {
    "id": 123,
    "name": "Hoodwink",
    "aliases": [
      "squirrel",
      "hw"
    ]
  },
  {
    "id": 126,
    "name": "Void Spirit",
    "aliases": [
      "Void",
      "VS",
      "Inai"
    ]
  },
  {
    "id": 128,
    "name": "Snapfire",
    "aliases": [
      "snap",
      "mortimer"
    ]
  },
  {
    "id": 129,
    "name": "Mars",
    "aliases": [
      "mars"
    ]
  },
  {
    "id": 135,
    "name": "Dawnbreaker",
    "aliases": [
      "Dawnbreaker",
      "Valora"
    ]
  },
  {
    "id": 136,
    "name": "Marci",
    "aliases": []
  },
  {
    "id": 137,
    "name": "Primal Beast",
    "aliases": []
  },
  {
    "id": 138,
    "name": "Muerta",
    "aliases": []
  }
]

export const items: TItems[] = [
  {
    "id": -1,
    "displayName": null
  },
  {
    "id": 1,
    "displayName": "Blink Dagger"
  },
  {
    "id": 2,
    "displayName": "Blades of Attack"
  },
  {
    "id": 3,
    "displayName": "Broadsword"
  },
  {
    "id": 4,
    "displayName": "Chainmail"
  },
  {
    "id": 5,
    "displayName": "Claymore"
  },
  {
    "id": 6,
    "displayName": "Helm of Iron Will"
  },
  {
    "id": 7,
    "displayName": "Javelin"
  },
  {
    "id": 8,
    "displayName": "Mithril Hammer"
  },
  {
    "id": 9,
    "displayName": "Platemail"
  },
  {
    "id": 10,
    "displayName": "Quarterstaff"
  },
  {
    "id": 11,
    "displayName": "Quelling Blade"
  },
  {
    "id": 12,
    "displayName": "Ring of Protection"
  },
  {
    "id": 13,
    "displayName": "Gauntlets of Strength"
  },
  {
    "id": 14,
    "displayName": "Slippers of Agility"
  },
  {
    "id": 15,
    "displayName": "Mantle of Intelligence"
  },
  {
    "id": 16,
    "displayName": "Iron Branch"
  },
  {
    "id": 17,
    "displayName": "Belt of Strength"
  },
  {
    "id": 18,
    "displayName": "Band of Elvenskin"
  },
  {
    "id": 19,
    "displayName": "Robe of the Magi"
  },
  {
    "id": 20,
    "displayName": "Circlet"
  },
  {
    "id": 21,
    "displayName": "Ogre Axe"
  },
  {
    "id": 22,
    "displayName": "Blade of Alacrity"
  },
  {
    "id": 23,
    "displayName": "Staff of Wizardry"
  },
  {
    "id": 24,
    "displayName": "Ultimate Orb"
  },
  {
    "id": 25,
    "displayName": "Gloves of Haste"
  },
  {
    "id": 26,
    "displayName": "Morbid Mask"
  },
  {
    "id": 27,
    "displayName": "Ring of Regen"
  },
  {
    "id": 28,
    "displayName": "Sage's Mask"
  },
  {
    "id": 29,
    "displayName": "Boots of Speed"
  },
  {
    "id": 30,
    "displayName": "Gem of True Sight"
  },
  {
    "id": 31,
    "displayName": "Cloak"
  },
  {
    "id": 32,
    "displayName": "Talisman of Evasion"
  },
  {
    "id": 33,
    "displayName": "Cheese"
  },
  {
    "id": 34,
    "displayName": "Magic Stick"
  },
  {
    "id": 35,
    "displayName": "Magic Wand Recipe"
  },
  {
    "id": 36,
    "displayName": "Magic Wand"
  },
  {
    "id": 37,
    "displayName": "Ghost Scepter"
  },
  {
    "id": 38,
    "displayName": "Clarity"
  },
  {
    "id": 39,
    "displayName": "Healing Salve"
  },
  {
    "id": 40,
    "displayName": "Dust of Appearance"
  },
  {
    "id": 41,
    "displayName": "Bottle"
  },
  {
    "id": 42,
    "displayName": "Observer Ward"
  },
  {
    "id": 43,
    "displayName": "Sentry Ward"
  },
  {
    "id": 44,
    "displayName": "Tango"
  },
  {
    "id": 45,
    "displayName": "Animal Courier"
  },
  {
    "id": 46,
    "displayName": "Town Portal Scroll"
  },
  {
    "id": 47,
    "displayName": "Boots of Travel Recipe"
  },
  {
    "id": 48,
    "displayName": "Boots of Travel"
  },
  {
    "id": 49,
    "displayName": ""
  },
  {
    "id": 50,
    "displayName": "Phase Boots"
  },
  {
    "id": 51,
    "displayName": "Demon Edge"
  },
  {
    "id": 52,
    "displayName": "Eaglesong"
  },
  {
    "id": 53,
    "displayName": "Reaver"
  },
  {
    "id": 54,
    "displayName": "Sacred Relic"
  },
  {
    "id": 55,
    "displayName": "Hyperstone"
  },
  {
    "id": 56,
    "displayName": "Ring of Health"
  },
  {
    "id": 57,
    "displayName": "Void Stone"
  },
  {
    "id": 58,
    "displayName": "Mystic Staff"
  },
  {
    "id": 59,
    "displayName": "Energy Booster"
  },
  {
    "id": 60,
    "displayName": "Point Booster"
  },
  {
    "id": 61,
    "displayName": "Vitality Booster"
  },
  {
    "id": 62,
    "displayName": ""
  },
  {
    "id": 63,
    "displayName": "Power Treads"
  },
  {
    "id": 64,
    "displayName": "Hand of Midas Recipe"
  },
  {
    "id": 65,
    "displayName": "Hand of Midas"
  },
  {
    "id": 66,
    "displayName": ""
  },
  {
    "id": 67,
    "displayName": "Oblivion Staff"
  },
  {
    "id": 68,
    "displayName": ""
  },
  {
    "id": 69,
    "displayName": "Perseverance"
  },
  {
    "id": 70,
    "displayName": ""
  },
  {
    "id": 71,
    "displayName": "Poor Man's Shield"
  },
  {
    "id": 72,
    "displayName": "Bracer Recipe"
  },
  {
    "id": 73,
    "displayName": "Bracer"
  },
  {
    "id": 74,
    "displayName": "Wraith Band Recipe"
  },
  {
    "id": 75,
    "displayName": "Wraith Band"
  },
  {
    "id": 76,
    "displayName": "Null Talisman Recipe"
  },
  {
    "id": 77,
    "displayName": "Null Talisman"
  },
  {
    "id": 78,
    "displayName": "Mekansm Recipe"
  },
  {
    "id": 79,
    "displayName": "Mekansm"
  },
  {
    "id": 80,
    "displayName": "Vladmir's Offering Recipe"
  },
  {
    "id": 81,
    "displayName": "Vladmir's Offering"
  },
  {
    "id": 84,
    "displayName": "Flying Courier"
  },
  {
    "id": 85,
    "displayName": "Buckler Recipe"
  },
  {
    "id": 86,
    "displayName": "Buckler"
  },
  {
    "id": 87,
    "displayName": "Ring of Basilius Recipe"
  },
  {
    "id": 88,
    "displayName": "Ring of Basilius"
  },
  {
    "id": 89,
    "displayName": "Pipe of Insight Recipe"
  },
  {
    "id": 90,
    "displayName": "Pipe of Insight"
  },
  {
    "id": 91,
    "displayName": "Urn of Shadows Recipe"
  },
  {
    "id": 92,
    "displayName": "Urn of Shadows"
  },
  {
    "id": 93,
    "displayName": "Headdress Recipe"
  },
  {
    "id": 94,
    "displayName": "Headdress"
  },
  {
    "id": 95,
    "displayName": "Scythe of Vyse Recipe"
  },
  {
    "id": 96,
    "displayName": "Scythe of Vyse"
  },
  {
    "id": 97,
    "displayName": "Orchid Malevolence Recipe"
  },
  {
    "id": 98,
    "displayName": "Orchid Malevolence"
  },
  {
    "id": 99,
    "displayName": "Eul's Scepter Recipe"
  },
  {
    "id": 100,
    "displayName": "Eul's Scepter of Divinity"
  },
  {
    "id": 101,
    "displayName": "Force Staff Recipe"
  },
  {
    "id": 102,
    "displayName": "Force Staff"
  },
  {
    "id": 103,
    "displayName": "Dagon Recipe"
  },
  {
    "id": 104,
    "displayName": "Dagon"
  },
  {
    "id": 105,
    "displayName": "Necronomicon Recipe"
  },
  {
    "id": 106,
    "displayName": "Necronomicon"
  },
  {
    "id": 107,
    "displayName": ""
  },
  {
    "id": 108,
    "displayName": "Aghanim's Scepter"
  },
  {
    "id": 109,
    "displayName": "Refresher Orb Recipe"
  },
  {
    "id": 110,
    "displayName": "Refresher Orb"
  },
  {
    "id": 111,
    "displayName": "Assault Cuirass Recipe"
  },
  {
    "id": 112,
    "displayName": "Assault Cuirass"
  },
  {
    "id": 113,
    "displayName": "Heart of Tarrasque Recipe"
  },
  {
    "id": 114,
    "displayName": "Heart of Tarrasque"
  },
  {
    "id": 115,
    "displayName": "Black King Bar Recipe"
  },
  {
    "id": 116,
    "displayName": "Black King Bar"
  },
  {
    "id": 117,
    "displayName": "Aegis of the Immortal"
  },
  {
    "id": 118,
    "displayName": "Shiva's Guard Recipe"
  },
  {
    "id": 119,
    "displayName": "Shiva's Guard"
  },
  {
    "id": 120,
    "displayName": "Bloodstone Recipe"
  },
  {
    "id": 121,
    "displayName": "Bloodstone"
  },
  {
    "id": 122,
    "displayName": "Linken's Sphere Recipe"
  },
  {
    "id": 123,
    "displayName": "Linken's Sphere"
  },
  {
    "id": 124,
    "displayName": ""
  },
  {
    "id": 125,
    "displayName": "Vanguard"
  },
  {
    "id": 126,
    "displayName": "Blade Mail Recipe"
  },
  {
    "id": 127,
    "displayName": "Blade Mail"
  },
  {
    "id": 128,
    "displayName": ""
  },
  {
    "id": 129,
    "displayName": "Soul Booster"
  },
  {
    "id": 130,
    "displayName": ""
  },
  {
    "id": 131,
    "displayName": "Hood of Defiance"
  },
  {
    "id": 132,
    "displayName": ""
  },
  {
    "id": 133,
    "displayName": "Divine Rapier"
  },
  {
    "id": 134,
    "displayName": "Monkey King Bar Recipe"
  },
  {
    "id": 135,
    "displayName": "Monkey King Bar"
  },
  {
    "id": 136,
    "displayName": "Radiance Recipe"
  },
  {
    "id": 137,
    "displayName": "Radiance"
  },
  {
    "id": 138,
    "displayName": ""
  },
  {
    "id": 139,
    "displayName": "Butterfly"
  },
  {
    "id": 140,
    "displayName": "Daedalus Recipe"
  },
  {
    "id": 141,
    "displayName": "Daedalus"
  },
  {
    "id": 142,
    "displayName": "Skull Basher Recipe"
  },
  {
    "id": 143,
    "displayName": "Skull Basher"
  },
  {
    "id": 144,
    "displayName": "Battle Fury Recipe"
  },
  {
    "id": 145,
    "displayName": "Battle Fury"
  },
  {
    "id": 146,
    "displayName": "Manta Style Recipe"
  },
  {
    "id": 147,
    "displayName": "Manta Style"
  },
  {
    "id": 148,
    "displayName": "Crystalys Recipe"
  },
  {
    "id": 149,
    "displayName": "Crystalys"
  },
  {
    "id": 150,
    "displayName": "Armlet of Mordiggian Recipe"
  },
  {
    "id": 151,
    "displayName": "Armlet of Mordiggian"
  },
  {
    "id": 152,
    "displayName": "Shadow Blade"
  },
  {
    "id": 153,
    "displayName": ""
  },
  {
    "id": 154,
    "displayName": "Sange and Yasha"
  },
  {
    "id": 155,
    "displayName": "Satanic Recipe"
  },
  {
    "id": 156,
    "displayName": "Satanic"
  },
  {
    "id": 157,
    "displayName": "Mjollnir Recipe"
  },
  {
    "id": 158,
    "displayName": "Mjollnir"
  },
  {
    "id": 159,
    "displayName": "Eye of Skadi Recipe"
  },
  {
    "id": 160,
    "displayName": "Eye of Skadi"
  },
  {
    "id": 161,
    "displayName": "Sange Recipe"
  },
  {
    "id": 162,
    "displayName": "Sange"
  },
  {
    "id": 163,
    "displayName": "Helm of the Dominator Recipe"
  },
  {
    "id": 164,
    "displayName": "Helm of the Dominator"
  },
  {
    "id": 165,
    "displayName": "Maelstrom Recipe"
  },
  {
    "id": 166,
    "displayName": "Maelstrom"
  },
  {
    "id": 167,
    "displayName": ""
  },
  {
    "id": 168,
    "displayName": "Desolator"
  },
  {
    "id": 169,
    "displayName": "Yasha Recipe"
  },
  {
    "id": 170,
    "displayName": "Yasha"
  },
  {
    "id": 171,
    "displayName": "Mask of Madness Recipe"
  },
  {
    "id": 172,
    "displayName": "Mask of Madness"
  },
  {
    "id": 173,
    "displayName": "Diffusal Blade Recipe"
  },
  {
    "id": 174,
    "displayName": "Diffusal Blade"
  },
  {
    "id": 175,
    "displayName": "Ethereal Blade Recipe"
  },
  {
    "id": 176,
    "displayName": "Ethereal Blade"
  },
  {
    "id": 177,
    "displayName": "Soul Ring Recipe"
  },
  {
    "id": 178,
    "displayName": "Soul Ring"
  },
  {
    "id": 179,
    "displayName": "Arcane Boots Recipe"
  },
  {
    "id": 180,
    "displayName": "Arcane Boots"
  },
  {
    "id": 181,
    "displayName": "Orb of Venom"
  },
  {
    "id": 182,
    "displayName": "Stout Shield"
  },
  {
    "id": 183,
    "displayName": ""
  },
  {
    "id": 184,
    "displayName": "Drum of Endurance Recipe"
  },
  {
    "id": 185,
    "displayName": "Drum of Endurance"
  },
  {
    "id": 186,
    "displayName": ""
  },
  {
    "id": 187,
    "displayName": "Medallion of Courage"
  },
  {
    "id": 188,
    "displayName": "Smoke of Deceit"
  },
  {
    "id": 189,
    "displayName": "Veil of Discord Recipe"
  },
  {
    "id": 190,
    "displayName": "Veil of Discord"
  },
  {
    "id": 191,
    "displayName": ""
  },
  {
    "id": 192,
    "displayName": ""
  },
  {
    "id": 193,
    "displayName": "Necronomicon"
  },
  {
    "id": 194,
    "displayName": "Necronomicon"
  },
  {
    "id": 195,
    "displayName": "Recipe: Diffusal Blade (level 2)"
  },
  {
    "id": 196,
    "displayName": "Diffusal Blade (level 2)"
  },
  {
    "id": 197,
    "displayName": ""
  },
  {
    "id": 198,
    "displayName": ""
  },
  {
    "id": 199,
    "displayName": ""
  },
  {
    "id": 200,
    "displayName": ""
  },
  {
    "id": 201,
    "displayName": "Dagon"
  },
  {
    "id": 202,
    "displayName": "Dagon"
  },
  {
    "id": 203,
    "displayName": "Dagon"
  },
  {
    "id": 204,
    "displayName": "Dagon"
  },
  {
    "id": 205,
    "displayName": "Rod of Atos Recipe"
  },
  {
    "id": 206,
    "displayName": "Rod of Atos"
  },
  {
    "id": 207,
    "displayName": "Abyssal Blade Recipe"
  },
  {
    "id": 208,
    "displayName": "Abyssal Blade"
  },
  {
    "id": 209,
    "displayName": "Heaven's Halberd Recipe"
  },
  {
    "id": 210,
    "displayName": "Heaven's Halberd"
  },
  {
    "id": 211,
    "displayName": ""
  },
  {
    "id": 212,
    "displayName": "Ring of Aquila"
  },
  {
    "id": 213,
    "displayName": "Tranquil Boots Recipe"
  },
  {
    "id": 214,
    "displayName": "Tranquil Boots"
  },
  {
    "id": 215,
    "displayName": "Shadow Amulet"
  },
  {
    "id": 216,
    "displayName": "Enchanted Mango"
  },
  {
    "id": 217,
    "displayName": ""
  },
  {
    "id": 218,
    "displayName": "Observer and Sentry Wards"
  },
  {
    "id": 219,
    "displayName": ""
  },
  {
    "id": 220,
    "displayName": "Boots of Travel 2"
  },
  {
    "id": 221,
    "displayName": "Lotus Orb Recipe"
  },
  {
    "id": 222,
    "displayName": "Meteor Hammer Recipe"
  },
  {
    "id": 223,
    "displayName": "Meteor Hammer"
  },
  {
    "id": 224,
    "displayName": "Nullifier Recipe"
  },
  {
    "id": 225,
    "displayName": "Nullifier"
  },
  {
    "id": 226,
    "displayName": "Lotus Orb"
  },
  {
    "id": 227,
    "displayName": "Solar Crest Recipe"
  },
  {
    "id": 228,
    "displayName": "Octarine Core Recipe"
  },
  {
    "id": 229,
    "displayName": "Solar Crest"
  },
  {
    "id": 230,
    "displayName": "Guardian Greaves Recipe"
  },
  {
    "id": 231,
    "displayName": "Guardian Greaves"
  },
  {
    "id": 232,
    "displayName": "Aether Lens"
  },
  {
    "id": 233,
    "displayName": "Aether Lens Recipe"
  },
  {
    "id": 234,
    "displayName": "Dragon Lance Recipe"
  },
  {
    "id": 235,
    "displayName": "Octarine Core"
  },
  {
    "id": 236,
    "displayName": "Dragon Lance"
  },
  {
    "id": 237,
    "displayName": "Faerie Fire"
  },
  {
    "id": 238,
    "displayName": "Iron Talon Recipe"
  },
  {
    "id": 239,
    "displayName": "Iron Talon"
  },
  {
    "id": 240,
    "displayName": "Blight Stone"
  },
  {
    "id": 241,
    "displayName": "Tango (Shared)"
  },
  {
    "id": 242,
    "displayName": "Crimson Guard"
  },
  {
    "id": 243,
    "displayName": "Crimson Guard Recipe"
  },
  {
    "id": 244,
    "displayName": "Wind Lace"
  },
  {
    "id": 245,
    "displayName": "Bloodthorn Recipe"
  },
  {
    "id": 246,
    "displayName": ""
  },
  {
    "id": 247,
    "displayName": "Moon Shard"
  },
  {
    "id": 248,
    "displayName": "Silver Edge Recipe"
  },
  {
    "id": 249,
    "displayName": "Silver Edge"
  },
  {
    "id": 250,
    "displayName": "Bloodthorn"
  },
  {
    "id": 251,
    "displayName": ""
  },
  {
    "id": 252,
    "displayName": "Echo Sabre"
  },
  {
    "id": 253,
    "displayName": "Glimmer Cape Recipe"
  },
  {
    "id": 254,
    "displayName": "Glimmer Cape"
  },
  {
    "id": 255,
    "displayName": "Aeon Disk Recipe"
  },
  {
    "id": 256,
    "displayName": "Aeon Disk"
  },
  {
    "id": 257,
    "displayName": "Tome of Knowledge"
  },
  {
    "id": 258,
    "displayName": "Kaya Recipe"
  },
  {
    "id": 259,
    "displayName": "Kaya"
  },
  {
    "id": 260,
    "displayName": "Refresher Shard"
  },
  {
    "id": 261,
    "displayName": "Crown"
  },
  {
    "id": 262,
    "displayName": "Hurricane Pike Recipe"
  },
  {
    "id": 263,
    "displayName": "Hurricane Pike"
  },
  {
    "id": 265,
    "displayName": "Infused Raindrops"
  },
  {
    "id": 266,
    "displayName": "Spirit Vessel Recipe"
  },
  {
    "id": 267,
    "displayName": "Spirit Vessel"
  },
  {
    "id": 268,
    "displayName": "Holy Locket Recipe"
  },
  {
    "id": 269,
    "displayName": "Holy Locket"
  },
  {
    "id": 270,
    "displayName": "Aghanim's Blessing Recipe"
  },
  {
    "id": 271,
    "displayName": "Aghanim's Blessing"
  },
  {
    "id": 272,
    "displayName": "Kaya and Sange Recipe"
  },
  {
    "id": 273,
    "displayName": "Kaya and Sange"
  },
  {
    "id": 274,
    "displayName": "Yasha and Kaya Recipe"
  },
  {
    "id": 275,
    "displayName": "Trident Recipe"
  },
  {
    "id": 276,
    "displayName": ""
  },
  {
    "id": 277,
    "displayName": "Yasha and Kaya"
  },
  {
    "id": 279,
    "displayName": "Ring of Tarrasque"
  },
  {
    "id": 286,
    "displayName": "Flying Courier"
  },
  {
    "id": 287,
    "displayName": "Keen Optic"
  },
  {
    "id": 288,
    "displayName": "Grove Bow"
  },
  {
    "id": 289,
    "displayName": "Quickening Charm"
  },
  {
    "id": 290,
    "displayName": "Philosopher's Stone"
  },
  {
    "id": 291,
    "displayName": "Force Boots"
  },
  {
    "id": 292,
    "displayName": "Stygian Desolator"
  },
  {
    "id": 293,
    "displayName": "Phoenix Ash"
  },
  {
    "id": 294,
    "displayName": "Seer Stone"
  },
  {
    "id": 295,
    "displayName": "Greater Mango"
  },
  {
    "id": 297,
    "displayName": "Vampire Fangs"
  },
  {
    "id": 298,
    "displayName": "Craggy Coat"
  },
  {
    "id": 299,
    "displayName": "Greater Faerie Fire"
  },
  {
    "id": 300,
    "displayName": "Timeless Relic"
  },
  {
    "id": 301,
    "displayName": "Mirror Shield"
  },
  {
    "id": 302,
    "displayName": "Elixir"
  },
  {
    "id": 303,
    "displayName": "Ironwood Tree Recipe"
  },
  {
    "id": 304,
    "displayName": "Ironwood Tree"
  },
  {
    "id": 305,
    "displayName": "Royal Jelly"
  },
  {
    "id": 306,
    "displayName": "Pupil's Gift"
  },
  {
    "id": 307,
    "displayName": "Tome of Aghanim"
  },
  {
    "id": 308,
    "displayName": "Repair Kit"
  },
  {
    "id": 309,
    "displayName": "Mind Breaker"
  },
  {
    "id": 310,
    "displayName": "Third Eye"
  },
  {
    "id": 311,
    "displayName": "Spell Prism"
  },
  {
    "id": 312,
    "displayName": "Horizon"
  },
  {
    "id": 313,
    "displayName": "Fusion Rune"
  },
  {
    "id": 317,
    "displayName": "Recipe: Fallen Sky"
  },
  {
    "id": 325,
    "displayName": "Prince's Knife"
  },
  {
    "id": 326,
    "displayName": "Spider Legs"
  },
  {
    "id": 327,
    "displayName": "Helm of the Undying"
  },
  {
    "id": 328,
    "displayName": "Mango Tree"
  },
  {
    "id": 329,
    "displayName": "Vambrace Recipe"
  },
  {
    "id": 330,
    "displayName": "Witless Shako"
  },
  {
    "id": 331,
    "displayName": "Vambrace"
  },
  {
    "id": 334,
    "displayName": "Imp Claw"
  },
  {
    "id": 335,
    "displayName": "Flicker"
  },
  {
    "id": 336,
    "displayName": "Telescope"
  },
  {
    "id": 349,
    "displayName": "Arcane Ring"
  },
  {
    "id": 354,
    "displayName": "Ocean Heart"
  },
  {
    "id": 355,
    "displayName": "Broom Handle"
  },
  {
    "id": 356,
    "displayName": "Trusty Shovel"
  },
  {
    "id": 357,
    "displayName": "Nether Shawl"
  },
  {
    "id": 358,
    "displayName": "Dragon Scale"
  },
  {
    "id": 359,
    "displayName": "Essence Ring"
  },
  {
    "id": 360,
    "displayName": "Clumsy Net"
  },
  {
    "id": 361,
    "displayName": "Enchanted Quiver"
  },
  {
    "id": 362,
    "displayName": "Ninja Gear"
  },
  {
    "id": 363,
    "displayName": "Illusionist's Cape"
  },
  {
    "id": 364,
    "displayName": "Havoc Hammer"
  },
  {
    "id": 365,
    "displayName": "Magic Lamp"
  },
  {
    "id": 366,
    "displayName": "Apex"
  },
  {
    "id": 367,
    "displayName": "Ballista"
  },
  {
    "id": 368,
    "displayName": "Woodland Striders"
  },
  {
    "id": 369,
    "displayName": "Trident"
  },
  {
    "id": 370,
    "displayName": "Book of the Dead"
  },
  {
    "id": 371,
    "displayName": "Fallen Sky"
  },
  {
    "id": 372,
    "displayName": "Pirate Hat"
  },
  {
    "id": 373,
    "displayName": "Dimensional Doorway"
  },
  {
    "id": 374,
    "displayName": "Ex Machina"
  },
  {
    "id": 375,
    "displayName": "Faded Broach"
  },
  {
    "id": 376,
    "displayName": "Paladin Sword"
  },
  {
    "id": 377,
    "displayName": "Minotaur Horn"
  },
  {
    "id": 378,
    "displayName": "Orb of Destruction"
  },
  {
    "id": 379,
    "displayName": "The Leveller"
  },
  {
    "id": 381,
    "displayName": "Titan Sliver"
  },
  {
    "id": 473,
    "displayName": "Voodoo Mask"
  },
  {
    "id": 485,
    "displayName": "Blitz Knuckles"
  },
  {
    "id": 533,
    "displayName": "Witch Blade Recipe"
  },
  {
    "id": 534,
    "displayName": "Witch Blade"
  },
  {
    "id": 565,
    "displayName": "Chipped Vest"
  },
  {
    "id": 566,
    "displayName": "Wizard Glass"
  },
  {
    "id": 569,
    "displayName": "Orb of Corrosion"
  },
  {
    "id": 570,
    "displayName": "Gloves of Travel"
  },
  {
    "id": 571,
    "displayName": "Trickster Cloak"
  },
  {
    "id": 573,
    "displayName": "Elven Tunic"
  },
  {
    "id": 574,
    "displayName": "Cloak of Flames"
  },
  {
    "id": 575,
    "displayName": "Venom Gland"
  },
  {
    "id": 576,
    "displayName": "Helm of the Gladiator"
  },
  {
    "id": 577,
    "displayName": "Possessed Mask"
  },
  {
    "id": 578,
    "displayName": "Ancient Perseverance"
  },
  {
    "id": 582,
    "displayName": "Oakheart"
  },
  {
    "id": 585,
    "displayName": "Stormcrafter"
  },
  {
    "id": 588,
    "displayName": "Overflowing Elixir"
  },
  {
    "id": 589,
    "displayName": "Fairy's Trinket"
  },
  {
    "id": 593,
    "displayName": "Fluffy Hat"
  },
  {
    "id": 596,
    "displayName": "Falcon Blade"
  },
  {
    "id": 597,
    "displayName": "Mage Slayer Recipe"
  },
  {
    "id": 598,
    "displayName": "Mage Slayer"
  },
  {
    "id": 599,
    "displayName": "Falcon Blade Recipe"
  },
  {
    "id": 600,
    "displayName": "Overwhelming Blink"
  },
  {
    "id": 603,
    "displayName": "Swift Blink"
  },
  {
    "id": 604,
    "displayName": "Arcane Blink"
  },
  {
    "id": 606,
    "displayName": "Arcane Blink Recipe"
  },
  {
    "id": 607,
    "displayName": "Swift Blink Recipe"
  },
  {
    "id": 608,
    "displayName": "Overwhelming Blink Recipe"
  },
  {
    "id": 609,
    "displayName": "Aghanim's Shard"
  },
  {
    "id": 610,
    "displayName": "Wind Waker"
  },
  {
    "id": 612,
    "displayName": "Wind Waker Recipe"
  },
  {
    "id": 633,
    "displayName": "Helm of the Overlord Recipe"
  },
  {
    "id": 635,
    "displayName": "Helm of the Overlord"
  },
  {
    "id": 637,
    "displayName": "Star Mace"
  },
  {
    "id": 638,
    "displayName": "Penta-Edged Sword"
  },
  {
    "id": 640,
    "displayName": "Orb of Corrosion Recipe"
  },
  {
    "id": 653,
    "displayName": ""
  },
  {
    "id": 655,
    "displayName": "Grandmaster's Glaive"
  },
  {
    "id": 674,
    "displayName": "Warhammer"
  },
  {
    "id": 675,
    "displayName": "Psychic Headband"
  },
  {
    "id": 676,
    "displayName": "Ceremonial Robe"
  },
  {
    "id": 677,
    "displayName": "Book of Shadows"
  },
  {
    "id": 678,
    "displayName": "Giant's Ring"
  },
  {
    "id": 679,
    "displayName": "Shadow of Vengeance"
  },
  {
    "id": 680,
    "displayName": "Bullwhip"
  },
  {
    "id": 686,
    "displayName": "Quicksilver Amulet"
  },
  {
    "id": 691,
    "displayName": "Eternal Shroud Recipe"
  },
  {
    "id": 692,
    "displayName": "Eternal Shroud"
  },
  {
    "id": 725,
    "displayName": "Aghanim's Shard - Consumable"
  },
  {
    "id": 727,
    "displayName": "Aghanim's Blessing - Roshan"
  },
  {
    "id": 731,
    "displayName": "Satchel"
  },
  {
    "id": 824,
    "displayName": "Assassin's Dagger"
  },
  {
    "id": 825,
    "displayName": "Ascetic's Cap"
  },
  {
    "id": 826,
    "displayName": "Assassin's Contract"
  },
  {
    "id": 827,
    "displayName": "Icarus Wings"
  },
  {
    "id": 828,
    "displayName": "Brigand's Blade"
  },
  {
    "id": 829,
    "displayName": "Arcanist's Armor"
  },
  {
    "id": 833,
    "displayName": "Bruiser's Maul Recipe"
  },
  {
    "id": 834,
    "displayName": "Blast Rig"
  },
  {
    "id": 835,
    "displayName": "Fae Grenade"
  },
  {
    "id": 836,
    "displayName": "Light Robes"
  },
  {
    "id": 837,
    "displayName": "Witchbane"
  },
  {
    "id": 838,
    "displayName": "Pig Pole"
  },
  {
    "id": 839,
    "displayName": "Ring of Fortitude"
  },
  {
    "id": 840,
    "displayName": "Tumbler's Toy"
  },
  {
    "id": 849,
    "displayName": "Mechanical Arm"
  },
  {
    "id": 859,
    "displayName": "Voidwalker Scythe Recipe"
  },
  {
    "id": 904,
    "displayName": "Voidwalker Scythe"
  },
  {
    "id": 906,
    "displayName": "Bruiser's Maul"
  },
  {
    "id": 907,
    "displayName": "Wraith Pact Recipe"
  },
  {
    "id": 908,
    "displayName": "Wraith Pact"
  },
  {
    "id": 910,
    "displayName": "Revenant's Brooch Recipe"
  },
  {
    "id": 911,
    "displayName": "Revenant's Brooch"
  },
  {
    "id": 928,
    "displayName": "\u0000"
  },
  {
    "id": 929,
    "displayName": "Eagle Eye"
  },
  {
    "id": 930,
    "displayName": "Boots of Bearing Recipe"
  },
  {
    "id": 931,
    "displayName": "Boots of Bearing"
  },
  {
    "id": 938,
    "displayName": ""
  },
  {
    "id": 939,
    "displayName": "Harpoon"
  },
  {
    "id": 940,
    "displayName": "Wand of the Brine"
  },
  {
    "id": 945,
    "displayName": "Seeds of Serenity"
  },
  {
    "id": 946,
    "displayName": "Lance of Pursuit"
  },
  {
    "id": 947,
    "displayName": "Occult Bracelet"
  },
  {
    "id": 948,
    "displayName": ""
  },
  {
    "id": 949,
    "displayName": "Ogre Seal Totem"
  },
  {
    "id": 950,
    "displayName": "Defiant Shell"
  },
  {
    "id": 964,
    "displayName": "Diffusal Blade"
  },
  {
    "id": 965,
    "displayName": "\u0000"
  },
  {
    "id": 968,
    "displayName": ""
  },
  {
    "id": 969,
    "displayName": ""
  },
  {
    "id": 990,
    "displayName": "Eye of the Vizier"
  },
  {
    "id": 998,
    "displayName": ""
  },
  {
    "id": 1000,
    "displayName": ""
  },
  {
    "id": 1017,
    "displayName": ""
  },
  {
    "id": 1021,
    "displayName": "River Vial: Chrome"
  },
  {
    "id": 1022,
    "displayName": "River Vial: Dry"
  },
  {
    "id": 1023,
    "displayName": "River Vial: Slime"
  },
  {
    "id": 1024,
    "displayName": "River Vial: Oil"
  },
  {
    "id": 1025,
    "displayName": "River Vial: Electrified"
  },
  {
    "id": 1026,
    "displayName": "River Vial: Potion"
  },
  {
    "id": 1027,
    "displayName": "River Vial: Blood"
  },
  {
    "id": 1028,
    "displayName": "Tombstone"
  },
  {
    "id": 1029,
    "displayName": "Super Blink Dagger"
  },
  {
    "id": 1030,
    "displayName": "Pocket Tower"
  },
  {
    "id": 1032,
    "displayName": "Pocket Roshan"
  },
  {
    "id": 1076,
    "displayName": "Specialist's Array"
  },
  {
    "id": 1077,
    "displayName": "Dagger of Ristul"
  },
  {
    "id": 1090,
    "displayName": "Mercy & Grace"
  },
  {
    "id": 1091,
    "displayName": "Samurai Tabi"
  },
  {
    "id": 1092,
    "displayName": "Hermes Sandals Recipe"
  },
  {
    "id": 1093,
    "displayName": "Hermes Sandals"
  },
  {
    "id": 1094,
    "displayName": "Lunar Crest Recipe"
  },
  {
    "id": 1095,
    "displayName": "Lunar Crest"
  },
  {
    "id": 1096,
    "displayName": "Disperser Recipe"
  },
  {
    "id": 1097,
    "displayName": "Disperser"
  },
  {
    "id": 1098,
    "displayName": "Samurai Tabi Recipe"
  },
  {
    "id": 1099,
    "displayName": "Witches Switch Recipe"
  },
  {
    "id": 1100,
    "displayName": "Witches Switch"
  },
  {
    "id": 1101,
    "displayName": "Harpoon Recipe"
  },
  {
    "id": 1106,
    "displayName": "Phylactery Recipe"
  },
  {
    "id": 1107,
    "displayName": "Phylactery"
  },
  {
    "id": 1122,
    "displayName": "Diadem"
  },
  {
    "id": 1123,
    "displayName": "Blood Grenade"
  },
  {
    "id": 1124,
    "displayName": "Spark of Courage"
  },
  {
    "id": 1125,
    "displayName": "Cornucopia"
  },
  {
    "id": 1127,
    "displayName": "Pavise Recipe"
  },
  {
    "id": 1128,
    "displayName": "Pavise"
  },
  {
    "id": 1154,
    "displayName": "Block of Cheese"
  },
  {
    "id": 1156,
    "displayName": "Ancient Guardian"
  },
  {
    "id": 1157,
    "displayName": "Safety Bubble"
  },
  {
    "id": 1158,
    "displayName": "Whisper of the Dread"
  },
  {
    "id": 1159,
    "displayName": "Nemesis Curse"
  },
  {
    "id": 1160,
    "displayName": "Aviana's Feather"
  },
  {
    "id": 1161,
    "displayName": "Unwavering Condition"
  },
  {
    "id": 1163,
    "displayName": null
  },
  {
    "id": 1164,
    "displayName": "Aetherial Hammer"
  },
  {
    "id": 1167,
    "displayName": "Light Collector"
  },
  {
    "id": 1168,
    "displayName": "Rattlecage"
  },
  {
    "id": 1466,
    "displayName": "Gleipnir"
  },
  {
    "id": 1565,
    "displayName": "Gleipnir Recipe"
  },
  {
    "id": 1800,
    "displayName": null
  },
  {
    "id": 1801,
    "displayName": "Caster Rapier"
  },
  {
    "id": 1802,
    "displayName": "Tiara of Selemene"
  },
  {
    "id": 1803,
    "displayName": "Doubloon"
  },
  {
    "id": 1804,
    "displayName": "Roshan's Banner"
  },
  {
    "id": 1805,
    "displayName": "Parasma Recipe"
  },
  {
    "id": 1806,
    "displayName": "Parasma"
  },
  {
    "id": 1807,
    "displayName": "Khanda Recipe"
  },
  {
    "id": 1808,
    "displayName": "Khanda"
  },
  {
    "id": 2091,
    "displayName": "Tier 1 Token"
  },
  {
    "id": 2092,
    "displayName": "Tier 2 Token"
  },
  {
    "id": 2093,
    "displayName": "Tier 3 Token"
  },
  {
    "id": 2094,
    "displayName": "Tier 4 Token"
  },
  {
    "id": 2095,
    "displayName": "Tier 5 Token"
  },
  {
    "id": 2096,
    "displayName": "Vindicator's Axe"
  },
  {
    "id": 2097,
    "displayName": "Duelist Gloves"
  },
  {
    "id": 2098,
    "displayName": "Horizon's Equilibrium"
  },
  {
    "id": 2099,
    "displayName": "Blighted Spirit"
  },
  {
    "id": 2190,
    "displayName": "Dandelion Amulet"
  },
  {
    "id": 2191,
    "displayName": "Turtle Shell"
  },
  {
    "id": 2192,
    "displayName": "Martyr's Plate"
  },
  {
    "id": 2193,
    "displayName": "Gossamer Cape"
  },
  {
    "id": 4204,
    "displayName": "Healing Lotus"
  },
  {
    "id": 4205,
    "displayName": "Great Healing Lotus"
  },
  {
    "id": 4206,
    "displayName": "Greater Healing Lotus"
  },
  {
    "id": 4207,
    "displayName": ""
  },
  {
    "id": 4208,
    "displayName": ""
  },
  {
    "id": 4300,
    "displayName": "Beloved Memory"
  },
  {
    "id": 4301,
    "displayName": "Scrying Shovel"
  },
  {
    "id": 4302,
    "displayName": "Forebearer's Fortune"
  }
]

export const staticInfo = [
  {
    "name": "start",
    "message": "Привет! Я нейросеть Winline. Меня зовут WinBot. Я могу проанализировать вводные по матчу, дать прогноз и научить тебя делать ставки. <br>С чего начнём?",
    "type": "text",
    "isInputEnabled": false,
    "next": ["wantPrediction", "howToBet"]
  },
  {
    "name": "wantPrediction",
    "message": "Я могу составить прогноз для тебя или показать, как ты можешь самостоятельно анализировать статистику. Что ты выберешь?",
    "type": "button",
    "title": "Хочу прогноз  на ставки от нашего  AI?",
    "isInputEnabled": false,
    "next": ["wantStatistic"]
  },
  {
    "name": "howToBet",
    "message": "Добро пожаловать в раздел аналитики! Я покажу тебе, как самостоятельно делать ставки на киберспорт. Следуй моим инструкциям и выбирай предложенные варианты. Чтобы вернуться к началу, нажми 'В начало обучения'. Для прогноза от нашего AI выбери Хочешь прогноз ставок от нашего AI. <br>Начнем!!",
    "type": "button",
    "title": "Как сделать ставку?",
    "isInputEnabled": false,
    "next": [
      "whatAreTheBets",
      "whatAreThePari",
      "minMaxBet",
      "toStart",
      "makeBet",
      "wantPrediction"
    ]
  },
  {
    "name": "wantStatistic",
    "message": "",
    "type": "button",
    "title": "Хочу узнать, как изучать статистику самостоятельно",
    "isInputEnabled": false,
    "next": []
  },
  {
    "name": "toStart",
    "message": "",
    "type": "button",
    "title": "В начало",
    "isInputEnabled": false,
    "next": ["start"]
  },
  {
    "name": "showStatistic",
    "message": "",
    "type": "button",
    "title": "ПОКАЗАТЬ СТАТИСТИКУ",
    "isInputEnabled": false,
    "next": [],
    "options": {
      "url": "https://winline.ru/stavki/sport/kibersport/dota_2"
    }
  },
  {
    "name": "makeBet",
    "message": "",
    "type": "button",
    "title": "Сделать ставку",
    "isInputEnabled": false,
    "next": [],
    "options": {
      "url": "https://winline.ru/stavki/sport/kibersport/dota_2"
    }
  },
  {
    "type": "button",
    "message": "На этот матч я могу дать прогноз по нескольким линиям, выбери одну из тех, что тебя интересует",
    "title": "name",
    "isInputEnabled": true,
    "next": ["makeBet"],
    "options": {
      url: "url"
    }
  },
  {
    "name": "startPrediction",
    "message": "",
    "type": "button",
    "title": "Давай прогназировать",
    "isInputEnabled": true,
    "next": ["tomorrowBet", "todayBet", "teamBet", "toStart"]
  },
  {
    "name": "tomorrowBet",
    "message": "Я могу предложить прогнозы на матчи, которые состоятся завтра. Какой матч интересует?",
    "type": "button",
    "title": "На что ставить завтра?",
    "isInputEnabled": false,
    "next": ["matches"]
  },
  {
    "name": "todayBet",
    "message": "Сегодня состоятся эти матчи. На какой из них ты хочешь получить прогноз?",
    "type": "button",
    "title": "На что ставить сегодня?",
    "isInputEnabled": false,
    "next": ["matches"]
  },
  {
    "name": "teamBet",
    "message": "Выбери команду из предложенного списка, чтобы сделать для тебя прогноз",
    "type": "button",
    "title": "Прогноз на команду",
    "isInputEnabled": false,
    "next": ["teams"]
  },
  {
    "name": "whatAreTheBets",
    "message": "Давай расскажу о различных видах ставок",
    "type": "button",
    "title": "Какие ставки?",
    "isInputEnabled": false,
    "next": [
      "toStart",
      "makeBet",
      "wantPrediction",
      "result",
      "total",
      "handicap"
    ]
  },
  {
    "name": "result",
    "message": "Ответ на то, что такое ставка на Исход. <br>Теперь ты знаешь, что такое Исход!<br>Хочешь сделать ставку или получить прогноз?",
    "type": "button",
    "title": "Исход",
    "isInputEnabled": false,
    "next": ["toStart", "makeBet", "wantPrediction"]
  },
  {
    "name": "total",
    "message": "Ответ на то, что такое ставка на Тотал. <br>Теперь ты знаешь, что такое Тотал!<br>Хочешь сделать ставку или получить прогноз?",
    "type": "button",
    "title": "Тотал",
    "isInputEnabled": false,
    "next": ["toStart", "makeBet", "wantPrediction"]
  },
  {
    "name": "handicap",
    "message": " Ответ на то, что такое ставка на Фору. <br>Теперь ты знаешь, что такое Фора!<br>Хочешь сделать ставку или получить прогноз?",
    "type": "button",
    "title": "Фора",
    "isInputEnabled": false,
    "next": ["toStart", "makeBet", "wantPrediction"]
  },
  {
    "name": "whatAreThePari",
    "message": "Давай расскажу о том, какие бывают пари",
    "type": "button",
    "title": "Какие пари?",
    "isInputEnabled": false,
    "next": [
      "toStart",
      "makeBet",
      "wantPrediction",
      "ordinar",
      "express",
      "systems"
    ]
  },
  {
    "name": "ordinar",
    "message": "_Про то, что такое Ординар...<br>Теперь вы можете выбрать, что мы рассмотрим дальше.",
    "type": "button",
    "title": "Ординар?",
    "isInputEnabled": false,
    "next": ["toStart", "makeBet", "wantPrediction", "howChoseOrdinar"]
  },
  {
    "name": "howChoseOrdinar",
    "message": "_Про то, как выбрать ординар",
    "type": "button",
    "title": "Как выбрать ординар?",
    "isInputEnabled": false,
    "next": ["toStart", "makeBet", "wantPrediction", "likesPari"]
  },
  {
    "name": "express",
    "message": "_Про то, что такое Экспресс...<br>У него также есть страховка, а далее вы можете узнать, как выбрать 'Экспресс'.",
    "type": "button",
    "title": "Экспресс",
    "isInputEnabled": false,
    "next": [
      "toStart",
      "makeBet",
      "wantPrediction",
      "howToChooseExpress",
      "insuranceExpress"
    ]
  },
  {
    "name": "howToChooseExpress",
    "message": "_Про то, как выбрать экспресс",
    "type": "button",
    "title": "Как выбрать экспресс?",
    "isInputEnabled": false,
    "next": ["toStart", "makeBet", "wantPrediction", "likesPari"]
  },
  {
    "name": "insuranceExpress",
    "message": "_Про то, что такое страховка экспресса",
    "type": "button",
    "title": "Страховка экспресса",
    "isInputEnabled": false,
    "next": ["toStart", "makeBet", "wantPrediction", "singleExpress"]
  },
  {
    "name": "singleExpress",
    "message": "_Про то, что такое единичная страховка",
    "type": "button",
    "title": "Экспресс в рамках одного события",
    "isInputEnabled": false,
    "next": ["toStart", "makeBet", "wantPrediction"]
  },
  {
    "name": "systems",
    "message": "_Про то, что такое Пари система.<br>Вы также можете продолжить ознакомление с информацией о том, как выбрать ставку 'Система'",
    "type": "button",
    "title": "Cистема",
    "isInputEnabled": false,
    "next": ["toStart", "makeBet", "wantPrediction", "howChooseSystem"]
  },
  {
    "name": "howChooseSystem",
    "message": "_Про то, как выбрать систему",
    "type": "button",
    "title": "Как выбрать систему",
    "isInputEnabled": false,
    "next": ["toStart", "makeBet", "wantPrediction", "likesPari"]
  },
  {
    "name": "likesPari",
    "message": "про _Любимые пари",
    "type": "button",
    "title": "Любимые пари",
    "isInputEnabled": false,
    "next": ["toStart", "makeBet", "wantPrediction", "combo"]
  },
  {
    "name": "combo",
    "message": "_Про КОМБОКОТИРОВКА",
    "type": "button",
    "title": "Комбокотировка",
    "isInputEnabled": false,
    "next": ["toStart", "makeBet", "wantPrediction"]
  },
  {
    "name": "minMaxBet",
    "message": "Могу рассказать о минимальных и максимальных ставках, а также о том, как отменить ставку",
    "type": "button",
    "title": "Как узнать максимальные и минимальные ставки ?",
    "isInputEnabled": false,
    "next": ["toStart", "makeBet", "wantPrediction", "undoBet"]
  },
  {
    "name": "undoBet",
    "message": "есть два возможных варианта",
    "type": "button",
    "title": "Как отменить ставку ?",
    "isInputEnabled": false,
    "next": [
      "toStart",
      "makeBet",
      "wantPrediction",
      "sellBet",
      "calcBetIfMatchCanceled"
    ]
  },
  {
    "name": "sellBet",
    "message": "Ответ на то, как продать ставку.<br>Теперь ты знаешь, как продать ставку.<br>Хочешь сделать ставку или получить прогноз?",
    "type": "button",
    "title": "Как продать ставку ?",
    "isInputEnabled": false,
    "next": ["toStart", "makeBet", "wantPrediction"]
  },
  {
    "name": "calcBetIfMatchCanceled",
    "message": "Ответ на то, как рассчитать ставку, если матч отменен.<br>Теперь ты знаешь, как рассчитать ставку если матч отменен.<br>Хочешь сделать ставку или получить прогноз?",
    "type": "button",
    "title": "Рассчитать ставку, если матч отменен",
    "isInputEnabled": false,
    "next": ["toStart", "makeBet", "wantPrediction"]
  }
];