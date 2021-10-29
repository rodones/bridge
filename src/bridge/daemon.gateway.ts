import { NotFoundError } from "@mikro-orm/core";
import { Logger } from "@nestjs/common";
import {
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
  OnGatewayInit,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from "@nestjs/websockets";
import { IncomingMessage } from "http";
import { Observable, of } from "rxjs";
import { Server, KeyAwareWebSocket } from "ws";
import { Message } from "./bridge.dto";
import { BridgeService } from "./bridge.service";

@WebSocketGateway({ path: "/ws/daemon" })
export class DaemonGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private server: Server;
  private readonly clients: Map<string, KeyAwareWebSocket>;
  private readonly logger: Logger;

  constructor(private readonly bridgeService: BridgeService) {
    this.clients = new Map();
    this.logger = new Logger(this.constructor.name);
  }

  afterInit(server: Server) {
    this.server = server;
  }

  async handleConnection(client: KeyAwareWebSocket, req: IncomingMessage) {
    const ip = req.socket.remoteAddress ?? "";
    const key = new URL(req.url, req.headers.origin ?? "http://localhost/").searchParams.get("key") ?? "";

    try {
      const node = await this.bridgeService.findNode(key);

      this.logger.log(`The node '${node.name}' connected from the address '${ip}'.`);

      const sendMessage = () => {
        client.send(JSON.stringify(new Message("exec", { cmd: "system/ram" })));
        // setTimeout(sendMessage, 1000);
      };

      sendMessage();
    } catch (e) {
      if (e instanceof NotFoundError) {
        this.logger.log(`The daemon from '${ip}' provided invalid key.`);

        client.send(JSON.stringify(new Message("die", "Invalid key.")));
      } else {
        this.logger.error(e);

        client.send(new Message("die", "Unhandled error occured."));
      }
      client.close();
    }

    client._rodonesKey = key;

    this.clients.set(key, client);
  }

  async handleDisconnect(client: KeyAwareWebSocket) {
    if (client._rodonesKey) {
      this.clients.delete(client._rodonesKey);

      const node = await this.bridgeService.findNode(client._rodonesKey);

      this.logger.log(`The node '${node.name}' is disconnected.`);
    }
  }

  @SubscribeMessage("exec")
  onExec(
    client: KeyAwareWebSocket,
    cmd: string,
    args: Record<string, any>,
    daemon_id: string,
  ): Observable<WsResponse<any>> {
    console.log(client);

    return of({
      event: "result",
      data: {
        command: { cmd, args, daemon_id },
        result: 5,
      },
    });
  }

  @SubscribeMessage("result")
  onResult(client: KeyAwareWebSocket, cmd: string, args: Record<string, any>) {
    console.log(cmd, args);
  }
}
