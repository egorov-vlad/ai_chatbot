import redisClient from '../module/redisClient';

export default class ChatService {
  protected userData: any;

  constructor(userData: any) {
    this.userData = userData;
  }

  static async sendMessage(message: string, history: { message: string; role: string; }[]) {
    history.push({
      message: message,
      role: 'user'
    }, {
      message: 'Chatbot response',
      role: 'bot'
    })

    return {
      botMessage: 'Chatbot response',
      history: history,
      options: {
        closeSession: false
      }
    }
  }
  async getData() {
    const data = await redisClient.get('data');
    return data;
  }
}