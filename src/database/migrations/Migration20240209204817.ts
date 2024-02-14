import { Migration } from '@mikro-orm/migrations';

export class Migration20240209204817 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "email" varchar(255) not null, add column "password" varchar(255) not null, add column "salt" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "email";');
    this.addSql('alter table "user" drop column "password";');
    this.addSql('alter table "user" drop column "salt";');
  }

}
