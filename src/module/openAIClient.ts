import { OpenAI, } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  timeout: 10000,
});

export type TChatMessageHistory = Array<ChatCompletionMessageParam>;


export async function sendMessageToGPT(message: string, history: TChatMessageHistory, prompt?: string) {
  const messages: TChatMessageHistory = [];

  if (prompt) {
    messages.push({
      role: 'system',
      content: prompt,
    });
  }

  if (history.length > 0) messages.push(...history)

  messages.push({
    role: "user",
    content: message
  })


  const completion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-3.5-turbo",
  }).catch(err => console.error(err));

  return completion?.choices;
}