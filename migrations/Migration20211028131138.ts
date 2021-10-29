import { Migration } from "@mikro-orm/migrations";

export class Migration20211028131138 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "create table `node` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `key` varchar(255) not null) default character set utf8mb4 engine = InnoDB;",
    );
  }
}
