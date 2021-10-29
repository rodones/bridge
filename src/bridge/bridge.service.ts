import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { Node } from "src/entities/node.entity";

@Injectable()
export class BridgeService {
  constructor(@InjectRepository(Node) private readonly nodeRepo: EntityRepository<Node>) {}

  async findNode(key: string) {
    return await this.nodeRepo.findOneOrFail({ key });
  }
}
