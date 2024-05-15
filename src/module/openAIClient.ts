import { OpenAI, } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import logger from './logger';
import type { TChatResponse } from '../utils/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  timeout: 10000,
});

export type TChatMessageHistory = Array<ChatCompletionMessageParam>;


export async function getAssistant() {
  try {
    const assistant = await openai.beta.assistants.list({
      order: "desc",
      limit: 10
    });

    return assistant;
  } catch (err) {
    logger.error(err);
  }
}


export async function createAssistant(prompt: string, name: string) {
  try {
    const assistant = await openai.beta.assistants.create({
      instructions: prompt,
      name: name,
      model: "gpt-4o-2024-05-13",
    });

    return assistant;
  }
  catch (err) {
    logger.error(err);
  }
}

export async function createThread() {
  try {
    const emptyThread = await openai.beta.threads.create();

    return emptyThread.id;
  }
  catch (err) {
    logger.error(err);
  }
}

export async function deleteAssistant(id: string) {
  try {
    const response = await openai.beta.assistants.del(id);
  } catch (err) {
    logger.error(err);
  }
}

export async function createRun(threadId: string, assistantId: string) {
  try {
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId
    });

    return run.id;
  } catch (err) {
    logger.error(err);
  }
}

export async function sendMessageToThread(threadId: string, message: string) {
  try {
    const res = await openai.beta.threads.messages.create(threadId, {
      role: "user", content: message,
    });

    return res;
  } catch (err) {
    logger.error(err);
  }
}


export async function pullMessages(threadId: string, runId: string) {
  try {
    const messages = await openai.beta.threads.runs.retrieve(threadId, runId);

    return messages;
  } catch (err) {
    logger.error(err);
  }
}

export async function getMessageList(threadId: string) {
  try {
    const messageList = await openai.beta.threads.messages.list(threadId);

    return deserializePredictionMessage(messageList);
  } catch (err) {
    logger.error(err);
  }
}

function deserializePredictionMessage(messageList: any): TChatResponse {
  const history: TChatMessageHistory = [];

  messageList.data.reverse().forEach((message: any) => {
    history.push({
      role: message.role,
      content: message.content[0].text.value
    });
  })

  return {
    role: 'assistant',
    message: history[history.length - 1].content
  }
}