import { Elysia } from 'elysia';
import messageRouter from './v1/message.router';
import staticRouter from './v1/static.router';
import matchesRouter from './v1/matches.router';
import teamsRouter from './v1/teams.router';
import predictionRouter from './v1/prediction.router';
import testRouter from './v1/test.router';

const router = new Elysia();

router.group('/api', (router) =>
  router.group('/v1', (router) => router
    .use(messageRouter)
    .use(staticRouter)
    .use(matchesRouter)
    .use(teamsRouter)
    .use(predictionRouter)
    // .use(testRouter)
  ));

export default router;