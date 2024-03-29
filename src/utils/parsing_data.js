import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import fs from 'fs';

//EPT Leaderboard
//https://liquipedia.net/dota2/ESL_Pro_Tour/Leaderboard

//dotabuff teams
//https://ru.dotabuff.com/esports/teams

//Tournament link
//https://liquipedia.net/dota2/DreamLeague/Season_23

const parsingTeamAndPlayers = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // try {
  await page.goto('https://liquipedia.net/dota2/DreamLeague/Season_23', {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForSelector('#mw-content-text > div > div:nth-child(16)');

  const html = await page.content();

  browser.close();

  const $ = cheerio.load(html);
  const teams = $('#mw-content-text > div > div:nth-child(16)')
    .children('.template-box')
    .get();

  const data = teams.map((team) => {
    const teamName = $(team).find('center').children('a').text();
    const teamPlayersElements = $(team)
      .find('table.wikitable.wikitable-bordered.list > tbody')
      .children('tr')
      .get();
    const teamPlayers = teamPlayersElements.map((player) => {
      return $(player).children('td').children('a').text();
    });

    return {
      name: teamName,
      players: teamPlayers,
    };
  });

  console.log(data);

  fs.writeFileSync('./temp/parsing_data.json', JSON.stringify(data));
};

const parsingDotabuffInfo = async () => {
  const teams = JSON.parse(fs.readFileSync('./temp/parsing_data.json', 'utf8'));

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto('https://ru.dotabuff.com/esports/teams', {
      waitUntil: 'domcontentloaded',
    });

    await page.waitForSelector('#teams-all > table');

    const html = await page.content();
    await browser.close();

    const $ = cheerio.load(html);

    const teamDotabuffs = $('#teams-all > table')
      .children('tbody')
      .children('tr')
      .get();

    const data = teamDotabuffs.map((team) => {
      const teamName = $(team)
        .children('td')
        .children('a')
        .children('span')
        .text()
        .trim();

      const dotabuffUrl = $(team)
        .children('td:nth-child(2)')
        .children('a')
        .attr('href');

      const winRate = $(team).children('td:nth-child(5)').attr('data-value');

      return {
        name: teamName,
        dotabuff: 'https://www.dotabuff.com' + dotabuffUrl,
        winRate: parseFloat(winRate) + '%',
      };
    });

    fs.writeFileSync('./temp/dotabuff_data.json', JSON.stringify(data));
  } catch (e) {
    browser.close();
    console.error(e);
  }
};

const mergeData = () => {
  const teams = JSON.parse(fs.readFileSync('./temp/parsing_data.json', 'utf8'));
  const dotabuffs = JSON.parse(
    fs.readFileSync('./temp/dotabuff_data.json', 'utf8')
  );
  const ept_leaderboard = JSON.parse(
    fs.readFileSync('./temp/ept_leaderboard.json', 'utf8')
  );

  const data = teams.map((team) => {
    const dotabuff = dotabuffs.find((dotabuff) => dotabuff.name === team.name);
    const ept = ept_leaderboard.find((ept) => ept.name === team.name);

    return {
      ...team,
      props: {
        totalWinRate: dotabuff?.winRate,
        dotabuff: {
          id: dotabuff?.dotabuff
            .replace('https://www.dotabuff.com/esports/teams/', '')
            .split('-')[0],
          url: dotabuff?.dotabuff,
        },
        eptRank: ept ? ept.eptRank : null,
        winRates: [],
      },
    };
  });

  fs.writeFileSync('./temp/teams.json', JSON.stringify(data));
};

const getEPTLeaderboard = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://liquipedia.net/dota2/ESL_Pro_Tour/Leaderboard', {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForSelector(
    '#mw-content-text > div > div.table-responsive > table'
  );

  const html = await page.content();

  await browser.close();

  const $ = cheerio.load(html);

  const eptLeaderboard = $(
    '#mw-content-text > div > div.table-responsive > table > tbody'
  )
    .children('tr')
    .get();

  const data = eptLeaderboard.map((team, index) => {
    if (index === 0) return;

    const teamName = $(team)
      .children('th')
      .children('span')
      .children('span.team-template-text')
      .children('a')
      .text()
      .trim();

    const eptRank = $(team)
      .children('td:nth-child(1)')
      .text()
      .trim()
      .split(' ')[0];
    console.log(eptRank);
    return {
      name: teamName,
      eptRank: eptRank,
    };
  });

  fs.writeFileSync('./temp/ept_leaderboard.json', JSON.stringify(data));
};

// getEPTLeaderboard();

// mergeData();

const getWinRatesVersus = async () => {
  const teams = JSON.parse(
    fs.readFileSync('./temp/teams_info_v1.json', 'utf8')
  );

  const toFile = [];
  let index = 0;
  for (const team of teams) {
    if (index <= 10) {
      index++;
      continue;
    }
    const winRatesList = await getVersusWinRates(team, teams);
    team.props.winRates = winRatesList;
    toFile.push(team);
    index++;
  }

  fs.writeFileSync(
    './temp/teams_info_v3.json',
    JSON.stringify(toFile, null, 2)
  );
};

const getVersusWinRates = async (team, teamsList) => {
  const out_json = [];
  for (const teams of teamsList) {
    if (team.name === teams.name) continue;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
      await page.goto(team.props.dotabuff.url + '/series', {
        waitUntil: 'domcontentloaded',
      });

      const button = await page.waitForSelector(
        '#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-47sehv'
      );
      await button.click();


      await page.waitForSelector('#team_search');

      const input = await page.$('#team_search');
      await input.type(teams.props.dotabuff.id);
      await page.keyboard.press('Enter');

      await page.waitForSelector(
        'body > div.container-outer.seemsgood > div.skin-container > div.container-inner.container-inner-content > div.content-inner > div.row-12 > div > section > article > div:nth-child(1) > table'
      );

      const html = await page.content();

      await browser.close();

      const $ = cheerio.load(html);

      const mathes = $(
        'body > div.container-outer.seemsgood > div.skin-container > div.container-inner.container-inner-content > div.content-inner > div.row-12 > div > section > article > div:nth-child(1) > table > tbody'
      )
        .children('tr')
        .get();

      if (!mathes.length) {
        out_json.push({
          teamName: teams.name,
          winRateVS: null,
          lastMatchesPlayedVS: null,
        });
        continue;
      }
      let mainTeamScore = 0;
      let versusTeamScore = 0;
      const data = mathes.map((match) => {
        if (match.attribs?.class) return;

        const teamWinner =
          $(match)
            .children('td.series-teams')
            .children('div.team.team-1.winner')
            .children('span:nth-child(2)')
            .children('a')
            .children('span')
            .text()
            .trim() ||
          $(match)
            .children('td.series-teams')
            .children('div.team.team-1.winner')
            .children('span:nth-child(2)')
            .children('span')
            .children('span')
            .text()
            .trim();

        if (!teamWinner) return 'draw';

        if (teamWinner === team.name) {
          mainTeamScore++;
        } else if (teamWinner === teams.name) {
          versusTeamScore++;
        }

        return teamWinner;
      });

      const winRateVS = isNaN(
        (mainTeamScore / (mainTeamScore + versusTeamScore)) * 100
      )
        ? null
        : Math.min(
            100,
            Math.max(
              0,
              (mainTeamScore / (mainTeamScore + versusTeamScore)) * 100
            )
          );

      console.log(
        team.name,
        teams.name,
        mainTeamScore,
        versusTeamScore,
        winRateVS === null ? null : winRateVS.toFixed(2) + '%'
      );

      out_json.push({
        teamName: teams.name,
        winRateVS: winRateVS === null ? null : winRateVS.toFixed(2) + '%',
        lastMatchesPlayedVS: data.filter((item) => item !== undefined).length,
      });
    } catch (err) {
      browser.close();
      console.error(team.name, teams.name, 'some error');
      continue;
    }
  }

  return out_json;
};

getWinRatesVersus();
