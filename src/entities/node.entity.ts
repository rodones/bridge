import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { v4 } from "uuid";

@Entity()
export class Node {
  @PrimaryKey()
  id!: number;

  @Unique()
  @Property()
  name!: string;

  @Property()
  createdAt = new Date();

  @Property()
  key = v4();

  constructor(name: string) {
    this.name = name;
  }
}
