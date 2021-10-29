import { WebSocket } from "ws";

declare module "ws" {
  interface KeyAwareWebSocket extends WebSocket {
    _rodonesKey: string;
  }
}
