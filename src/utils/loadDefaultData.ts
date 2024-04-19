import redisClient from '../module/redisClient';

export type TTeam = {
  id?: number;
  name: string;
  teamId?: number;
}

export async function loadDefaultData() {

  const teams: TTeam[] = [{
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
    teamId: 0
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


  await redisClient.set('teams', JSON.stringify(teams));

  return teams;
}