import { Migration } from '@mikro-orm/migrations';

export class Migration20240607104257_AddMatrixIdToSim extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_simulation" add column "matrix_id" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_simulation" drop column "matrix_id";');
  }

}
