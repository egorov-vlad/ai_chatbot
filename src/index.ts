import { Elysia, t } from 'elysia';
import redisClient from './module/redisClient';
import router from './router';
import swagger from '@elysiajs/swagger';
import { createAssistant, getAssistant } from './module/openAIClient';
import { predictionPrompt, textAnalyserPrompt } from './utils/constants';
import type OpenAI from 'openai';

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
  console.log(`Server started on port ${PORT}`);
});

redisClient
  .connect()
  .then(() => {
    // getAssistants();
  })
  .catch((e) => {
    console.error(e);
  });


const getAssistants = async () => {
  const assistantList = await getAssistant();
  let predictorAssistant: OpenAI.Beta.Assistants.Assistant;
  let supportAssistant: OpenAI.Beta.Assistants.Assistant;

  predictorAssistant = assistantList.data.find((assistant) => assistant.name === "Predictor") ||
    await createAssistant(predictionPrompt, "Predictor");
  supportAssistant = assistantList.data.find((assistant) => assistant.name === "Support")
    || await createAssistant(textAnalyserPrompt, "Support");

  console.log("Assistants: ", predictorAssistant.id, supportAssistant.id);

  await redisClient.set("predictorAssistant", predictorAssistant?.id);
  await redisClient.set("supportAssistant", supportAssistant?.id);
}