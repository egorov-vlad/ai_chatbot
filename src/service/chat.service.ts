import redisClient from '../module/redisClient';
import prisma from '../db';

export default class ChatService {
  protected userData: any;

  constructor(userData: any) {
    this.userData = userData;
  }

  async getData() {
    const data = await redisClient.get('data');
    return data;
  }

  async getDataFromDb() {
    await prisma.teams.create({
      data: {
        name: 'winline_ai_chatbot',
        players: ['bot1', 'bot2', 'bot3']
      }
    });

    const data = await prisma.teams.findMany({
      where: {
        id: 1
      }
    });

    console.log(data);
  }
}