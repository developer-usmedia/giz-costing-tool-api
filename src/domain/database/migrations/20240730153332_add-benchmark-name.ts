import { Migration } from '@mikro-orm/migrations';

export class Migration20240730153332_AddBenchmarkName extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_entry" add column "benchmark__name" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_entry" drop column "benchmark__name";');
  }

}
