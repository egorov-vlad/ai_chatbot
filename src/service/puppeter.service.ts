import puppeteer from 'puppeteer';
import cheerio from 'cheerio';

export class PuppeteerService {
  constructor() { }

  public async getPageInfo() {
    console.time('puppeteer');
    const url = "https://winline.ru/plus/11678734"
    const browser = await puppeteer.launch();
    try {
      const page = await browser.newPage();

      await page.goto(url);

      await page.waitForSelector("#main > div.main__wrapper > div.content > ww-feature-eventpage-dsk > div.ww-markets.ng-star-inserted > div.ww-markets__stickybar > ww-feature-marketbook-stickybar-gen > div > div.special__btns-wrapper > ww-shared-stats-link > a");

      const html = await page.content();
      let $ = cheerio.load(html);

      const statUrlId = $("#main > div.main__wrapper > div.content > ww-feature-eventpage-dsk > div.ww-markets.ng-star-inserted > div.ww-markets__stickybar > ww-feature-marketbook-stickybar-gen > div > div.special__btns-wrapper > ww-shared-stats-link > a").attr("href")?.split("#")[1];

      const statUrl = `https://widget.pandascore.co/v2/match?lang=ru-RU&id=${statUrlId}&scoreboard=detailed`;

      await page.goto(statUrl);

      await page.waitForSelector("#app > main > section:nth-child(1) > div.c0bed-blockContent.b5dce-matchTitleBlockContent > h1");

      const statHtml = await page.content();
      await browser.close();

      $ = cheerio.load(statHtml);

      const killsRightTeam = $("#app > main > section:nth-child(1) > div.c0bed-blockContent.b5dce-matchTitleBlockContent > h1").text();

      console.log(killsRightTeam);

    } catch (error) {
      console.error(error);
      await browser.close()
    }

    console.timeEnd('puppeteer');
  }
}
