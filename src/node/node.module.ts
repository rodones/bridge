import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Node } from "src/entities/node.entity";
import { NodeService } from "./node.service";
import { NodeController } from "./node.controller";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Node] })],
  controllers: [NodeController],
  providers: [NodeService],
})
export class NodeModule {}
