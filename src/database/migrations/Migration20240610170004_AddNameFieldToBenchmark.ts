import { Migration } from '@mikro-orm/migrations';

export class Migration20240610170004_AddNameFieldToBenchmark extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_simulation" add column "benchmark_name" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_simulation" drop column "benchmark_name";');
  }

}
