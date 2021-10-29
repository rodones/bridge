import { Migration } from "@mikro-orm/migrations";

export class Migration20211028140119 extends Migration {
  async up(): Promise<void> {
    this.addSql("alter table `node` add `name` varchar(255) not null;");
    this.addSql("alter table `node` add unique `node_name_unique`(`name`);");
  }
}
