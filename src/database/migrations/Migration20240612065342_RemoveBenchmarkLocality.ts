import { Migration } from '@mikro-orm/migrations';

export class Migration20240612065342_RemoveBenchmarkLocality extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_entry" drop column "benchmark_locality";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_entry" add column "benchmark_locality" varchar(50) null;');
  }

}
