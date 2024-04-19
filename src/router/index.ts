import { Elysia } from 'elysia';
import messageRouter from './v1/message.router';
import tutorialRouter from './v1/tutorial.router';
import matchesRouter from './v1/matches.router';
import teamsRouter from './v1/teams.router';
import predictionRouter from './v1/prediction.router';

const router = new Elysia();

router.group('/api', (router) =>
  router.group('/v1', (router) => router
    .use(messageRouter)
    .use(tutorialRouter)
    .use(matchesRouter)
    .use(teamsRouter)
    .use(predictionRouter)
  ));

export default router;