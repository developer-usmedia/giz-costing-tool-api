import { Migration } from '@mikro-orm/migrations';

export class Migration20240605081034_AddRefreshTokenToUser extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_user" add column "refresh_token" varchar(255) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_user" drop column "refresh_token";');
  }

}
