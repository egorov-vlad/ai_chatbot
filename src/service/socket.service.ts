import redisClient from '../module/redisClient';

interface Player {
  alive: boolean;
  assists: number;
  deaths: number;
  hero: {
      id: number;
      name: string;
  };
  id: number;
  kills: number;
  last_hits: number;
  level: number;
  name: string;
}

interface Barracks {
  destroyed: number;
  remaining: number;
}

interface Towers {
  destroyed: number;
  remaining: number;
}

interface Team {
  barracks: Barracks;
  id: number;
  name: string;
  players: Player[];
  score: number;
  towers: Towers;
}

interface Game {
  finished: boolean;
  id: number;
  winner_id: number | null;
}

interface Map {
  daytime: boolean;
}

interface Match {
  id: number;
}

interface Tournament {
  id: number;
}

interface Data {
  current_timestamp: number;
  dire: Team;
  game: Game;
  map: Map;
  match: Match;
  radiant: Team;
  tournament: Tournament;
}

export class SocketService {
  private url: string;
  private socket: WebSocket;

  constructor(url: string) {
    this.url = url;
    this.socket = new WebSocket(url + '?token=' + process.env.PANDASCORE_API_KEY);
    this.connect();
  }

  private connect() {

    this.socket.onopen = () => {
      console.log(`connected: ${this.url}`);
    }

    this.socket.onmessage = async ({ data }) => {
      const message = JSON.parse(data) as Data;
      // console.log(this.url, data);
      if (message?.match) {
        redisClient.set(`pandascoreLiveData:${message.match.id}`, JSON.stringify(message))
      }
    }

    this.socket.onclose = async () => {
      console.log(`disconnected: ${this.url}`);
      const id = this.url.match(/\d+/);
      if (id)
        await redisClient.del(`pandascoreLiveData:${id}`)
    }

    this.socket.onerror = async (error) => {
      console.error(this.url, error);
      const id = this.url.match(/\d+/);
      if (id)
        await redisClient.del(`pandascoreLiveData:${id}`)
      this.socket.close();
    }
  }

  public close() {
    this.socket.close();
  }
}