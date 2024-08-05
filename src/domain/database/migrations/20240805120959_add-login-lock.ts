import { Migration } from '@mikro-orm/migrations';

export class Migration20240805120959_AddLoginLock extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_user" add column "failed_login_attempts" integer not null default 0, add column "failed_login_lock_until" timestamp null, add column "failed_login_ip" varchar(50) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_user" drop column "failed_login_attempts";');
    this.addSql('alter table "giz_user" drop column "failed_login_lock_until";');
    this.addSql('alter table "giz_user" drop column "failed_login_ip";');
  }

}
