import { Migration } from '@mikro-orm/migrations';

export class Migration20240611091353_AddNameFieldToBenchmark extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_simulation" add column "benchmark_name" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_simulation" drop column "benchmark_name";');
  }

}
