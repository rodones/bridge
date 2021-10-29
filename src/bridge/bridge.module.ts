import { Module } from "@nestjs/common";

import { DaemonGateway } from "./daemon.gateway";
import { PanelGateway } from "./panel.gateway";
import { BridgeService } from "./bridge.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Node } from "src/entities/node.entity";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Node] })],
  providers: [BridgeService, DaemonGateway, PanelGateway],
})
export class BridgeModule {}
