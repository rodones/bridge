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
import fetch from "cross-fetch";
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

      client._rodonesKey = key;
      this.clients.set(key, client);
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
  }

  async handleDisconnect(client: KeyAwareWebSocket) {
    if (client._rodonesKey) {
      this.clients.delete(client._rodonesKey);

      const node = await this.bridgeService.findNode(client._rodonesKey);

      this.logger.log(`The node '${node.name}' is disconnected.`);
    }
  }

  @SubscribeMessage("exec")
  async onExec(client: KeyAwareWebSocket, data: Record<string, any>) {
    await this.waitRegister(client);

    console.log(data);
  }

  @SubscribeMessage("result")
  async onResult(client: KeyAwareWebSocket, data: Record<string, any>) {
    await this.waitRegister(client);

    console.log(data);
  }

  private waitRegister(client: KeyAwareWebSocket) {
    return new Promise((resolve, reject) => {
      const loop = (retryNo = 0) => {
        if (retryNo === 10) reject("timeout");

        if ("_rodonesKey" in client) {
          return resolve(client);
        }

        setTimeout(() => loop(retryNo + 1), 100);
      };

      loop();
    });
  }

  @SubscribeMessage("critical_resource_usage")
  async onCriticalResourceUsage(client: KeyAwareWebSocket, data: Record<string, any>) {
    await this.waitRegister(client);

    const node = await this.bridgeService.findNode(client._rodonesKey);

    const result = await fetch(`https://api.telegram.org/bot${process.env.RODONES_TELEGRAM_API_KEY}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: process.env.RODONES_TELEGRAM_CHAT_ID,
        parse_mode: "html",
        text: `<b>${node.name}</b> - ⚠️ High ${data.name} consumption!

- total: ${(data.stats.total / 1073741824).toFixed(2)}
- used: ${(data.stats.used / 1073741824).toFixed(2)}
- free: ${(data.stats.free / 1073741824).toFixed(2)}
- percent: ${data.stats.percent}`,
      }),
    }).then((res) => res.json());

    if (!result.ok) {
      return this.logger.error(result);
    }
  }
}
