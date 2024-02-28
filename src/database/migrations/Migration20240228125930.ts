import { Migration } from '@mikro-orm/migrations';

export class Migration20240228125930 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop column "reset_token";');

    this.addSql('alter table "user" add column "email_verfied" boolean not null default false, add column "verification_code" varchar(6) null;');
    this.addSql('alter table "user" rename column "reset_token_expire" to "verification_expires_at";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "email_verfied";');
    this.addSql('alter table "user" drop column "verification_code";');

    this.addSql('alter table "user" add column "reset_token" varchar(255) null;');
    this.addSql('alter table "user" rename column "verification_expires_at" to "reset_token_expire";');
  }

}
