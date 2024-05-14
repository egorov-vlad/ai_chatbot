import { OpenAI, } from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
  timeout: 10000,
});

export type TChatMessageHistory = Array<ChatCompletionMessageParam>;


export async function sendMessageToGPT(message: string, history: TChatMessageHistory, prompt?: string, data?: any) {
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
    model: "gpt-4-turbo",
    response_format: {
      type: 'json_object'
    }
  }).catch(err => console.error(err));

  return completion;
}

export async function getAssistant() {
  const assistant = await openai.beta.assistants.list({
    order: "desc",
    limit: 10
  });

  // console.log(assistant);

  return assistant;
}


export async function createAssistant(prompt: string, name: string) {
  const assistant = await openai.beta.assistants.create({
    instructions: prompt,
    metadata: {

    },
    name: name,
    model: "gpt-4o-2024-05-13",
    // response_format: {
    //   type: 'json_object'
    // }
  });

  return assistant;
}

export async function createThread() {
  const emptyThread = await openai.beta.threads.create();

  return emptyThread.id;
}

export async function deleteAssistant(id: string) {
  const response = await openai.beta.assistants.del(id);
}

export async function createRun(threadId: string, assistantId: string) {
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId
  });

  return run.id;
}

export async function sendMessageToThread(threadId: string, message: string) {
  const res = await openai.beta.threads.messages.create(threadId, {
    role: "user", content: message,
  });

  return res;
}


export async function pullMessages(threadId: string, runId: string) {
  const messages = await openai.beta.threads.runs.retrieve(threadId, runId);

  return messages;
}

export async function getMessageList(threadId: string) {
  const messageList = await openai.beta.threads.messages.list(threadId);
  let message: string[] = [];

  // const assistantResponses = messageList.data.filter(msg => msg.role === 'assistant');

  // const response = assistantResponses.map(msg => 
  //   msg.content
  //     .filter(contentItem => contentItem.type === 'text')
  //     .map(textContent => textContent)
  //     .join('\n')
  // ).join('\n');

  return deserializePredictionMessage(messageList);
}

function deserializePredictionMessage(messageList: any) {
  const history: TChatMessageHistory = [];

  messageList.data.reverse().forEach((message: any) => {
    history.push({
      role: message.role,
      content: message.content[0].text.value
    });
  })

  return {
    // history: history,
    role: 'assistant',
    message: history[history.length - 1].content
  }

}