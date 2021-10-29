import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { Node } from "src/entities/node.entity";
import { CreateNodeDto, UpdateNodeDto } from "./node.dto";

@Injectable()
export class NodeService {
  constructor(@InjectRepository(Node) private readonly nodeRepo: EntityRepository<Node>) {}

  async create(dto: CreateNodeDto) {
    const node = new Node(dto.name);

    await this.nodeRepo.persistAndFlush(node);

    return node;
  }

  async findAll() {
    return await this.nodeRepo.findAll();
  }

  async findOne(id: number) {
    return await this.nodeRepo.findOneOrFail(id);
  }

  async update(id: number, dto: UpdateNodeDto) {
    const node = await this.nodeRepo.findOneOrFail(id);

    node.name = dto.name ?? node.name;

    await this.nodeRepo.flush();
    return node;
  }

  async remove(id: number) {
    const node = await this.nodeRepo.findOneOrFail(id);
    this.nodeRepo.removeAndFlush(node);
    return node;
  }
}
