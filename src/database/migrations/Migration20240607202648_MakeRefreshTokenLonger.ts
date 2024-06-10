import { Migration } from '@mikro-orm/migrations';

export class Migration20240607202648_MakeRefreshTokenLonger extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_user" alter column "refresh_token" type varchar(400) using ("refresh_token"::varchar(400));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_user" alter column "refresh_token" type varchar(255) using ("refresh_token"::varchar(255));');
  }

}
