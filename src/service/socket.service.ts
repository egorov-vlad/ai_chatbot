import redisClient from '../module/redisClient';

export class SocketService {
  private matchId: number;
  private socket: WebSocket;

  constructor(matchId: number) {
    this.matchId = matchId;
    this.socket = new WebSocket(`wss://live.pandascore.co/matches/${this.matchId}`);
    this.connect();
  }

  private connect() {

    this.socket.onopen = () => {
      console.log(`connected: ${this.matchId}`);
      this.socket.send(JSON.stringify(["3", "3", `v2:match:${this.matchId}`, "phx_join", {}]));
    }

    this.socket.onmessage = async ({ data }) => {
      const message = JSON.parse(data);
      console.log(this.matchId, data);

      if (message[4]?.status === "ok") {
        setTimeout(() => {
          this.socket.send(JSON.stringify([
            null,
            parseInt(message[1]) + 1,
            "phoenix",
            "heartbeat",
            {}
          ]));
        })
      } else if (message[4]?.games) {
        if (message[4].match_status === "running") {
          await redisClient.set(`pandascoreMatchSocket:${this.matchId}`, JSON.stringify(message[4]));
        } else {
          await redisClient.del(`pandascoreMatchSocket:${this.matchId}`);
          this.socket.close();
        }
      }
    }

    this.socket.onclose = () => {
      console.log(`disconnected: ${this.matchId}`);
    }

    this.socket.onerror = (error) => {
      console.log(this.matchId, error);
      this.socket.close();
    }
  }

  public close() {
    this.socket.close();
  }
}