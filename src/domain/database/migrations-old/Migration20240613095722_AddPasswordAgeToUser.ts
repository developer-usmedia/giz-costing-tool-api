import { Migration } from '@mikro-orm/migrations';

export class Migration20240613095722_AddPasswordAgeToUser extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_user" add column "password_created_at" timestamp not null default \'now\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_user" drop column "password_created_at";');
  }

}
