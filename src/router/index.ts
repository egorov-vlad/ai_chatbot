import { Elysia } from 'elysia';
import messageRouter from './v1/message.router';
import staticRouter from './v1/static.router';
import matchesRouter from './v1/matches.router';
import teamsRouter from './v1/teams.router';
import predictionRouter from './v1/prediction.router';
import testRouter from './v1/test.router';
import { MainService } from '../service/main.service';
import { matchDataRouter } from './v1/matchData.router';
import logger from '../module/logger';

const router = new Elysia();

router.onRequest((ctx) => {
  logger.info(ctx.request.method + ' ' + ctx.request.url);
})

router.onError((ctx) => {
  logger.error(ctx.request.method + ' ' + ctx.request.url + ' ' + ctx.code + ' ' + ctx.error.message);
})

router.group('/api', (router) =>
  router.group('/v1', (router) => router
    .decorate('main', () => new MainService())
    .use(messageRouter)
    .use(staticRouter)
    .use(matchesRouter)
    .use(teamsRouter)
    .use(predictionRouter)
    // .use(testRouter)
    .use(matchDataRouter)
  ));

export default router;