import { ApiOAuth2 } from "@nestjs/swagger";
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayInit,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from "@nestjs/websockets";
import { Observable, of } from "rxjs";
import { Server, WebSocket } from "ws";

@ApiOAuth2([])
@WebSocketGateway({ path: "/ws/panel" })
export class PanelGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log("afterInit");
  }

  handleConnection(client: WebSocket, ...args: any[]) {
    console.log("handleConnection");
    console.log(client);
    client.close();
  }

  handleDisconnect(client: WebSocket) {
    console.log("handleDisconnect");
  }

  // panel -> bridge -> daemon
  @SubscribeMessage("exec")
  onExec(client: WebSocket, cmd: string, args: Record<string, any>, daemon_id: string): Observable<WsResponse<any>> {
    console.log(client);

    return of({
      event: "result",
      data: {
        command: { cmd, args, daemon_id },
        result: 5,
      },
    });
  }

  // panel -> bridge -> daemon
  @SubscribeMessage("stream")
  onStream(client: WebSocket, cmd: string, args: Record<string, any>, daemon_id: string): Observable<WsResponse<any>> {
    console.log(client);

    return of({
      event: "result",
      data: {
        command: { cmd, args, daemon_id },
        result: 5,
      },
    });
  }
}
