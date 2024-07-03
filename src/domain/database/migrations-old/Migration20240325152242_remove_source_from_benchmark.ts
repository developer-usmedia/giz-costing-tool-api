import { Migration } from '@mikro-orm/migrations';

export class Migration20240325152242_remove_source_from_benchmark extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_benchmark" drop column "source";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_benchmark" add column "source" varchar(100) null;');
  }

}
