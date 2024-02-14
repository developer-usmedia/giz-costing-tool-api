import { Migration } from '@mikro-orm/migrations';

export class Migration20240210084631 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "reset_token" varchar(255) null, add column "reset_token_expire" timestamptz null;');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_email_unique";');
    this.addSql('alter table "user" drop column "reset_token";');
    this.addSql('alter table "user" drop column "reset_token_expire";');
  }

}
