import { Elysia, t } from 'elysia';
import redisClient from './module/redisClient';
import router from './router';
import swagger from '@elysiajs/swagger';
import { createAssistant, getAssistant } from './module/openAIClient';
import { predictionPrompt, textAnalyserPrompt } from './utils/constants';
import type OpenAI from 'openai';
import logger from './module/logger';

const app = new Elysia();
const PORT = process.env.PORT || 3000;

app.use(swagger({
  documentation: {
    info: {
      title: 'Winline AI Chatbot',
      description: 'Winline AI Chatbot API',
      version: '1.0.0',
    },
    tags: [
      {
        name: 'Chatbot',
        description: 'Chatbot API'
      }
    ]
  },
}));

app.guard({
  headers: t.Object({
    'x-api-key': t.String({
      required: true,
      condition: (key: string) => key === process.env.API_KEY
    }),
  })
})


app.use(router);

app.listen({
  port: PORT,
  hostname: '0.0.0.0',
  tls: {
    // key: Bun.file(process.env.SSL_KEY as string),
    // cert: Bun.file(process.env.SSL_CERT as string),
  }
}, () => {
  logger.info(`Server started on port ${PORT}`);
});


redisClient
  .connect()
  .then(() => {
    getAssistants();
  })
  .catch((err) => {
    logger.error("Redis connection error", err);
  });


const getAssistants = async () => {
  const assistantList = await getAssistant();
  if (!assistantList) {
    logger.error("Assistants not found");
    return;
  }

  let predictorAssistant: OpenAI.Beta.Assistants.Assistant | undefined;
  let supportAssistant: OpenAI.Beta.Assistants.Assistant | undefined;

  predictorAssistant = assistantList.data.find((assistant) => assistant.name === "Predictor") ||
    await createAssistant(predictionPrompt, "Predictor");
  supportAssistant = assistantList.data.find((assistant) => assistant.name === "Support")
    || await createAssistant(textAnalyserPrompt, "Support");

  if (!predictorAssistant || !supportAssistant) {
    logger.error("Assistants not found");
    return;
  }

  logger.info("Assistants: " + predictorAssistant.id + " " + supportAssistant.id);

  await redisClient.set("predictorAssistant", predictorAssistant?.id);
  await redisClient.set("supportAssistant", supportAssistant?.id);
}

setInterval(getAssistants, 1000 * 60 * 2);