import { Migration } from '@mikro-orm/migrations';

export class Migration20240613103030_AddFailedLoginAttemptsToUser extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_user" add column "failed_login_attempts" integer not null default 0;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_user" drop column "failed_login_attempts";');
  }

}
