import { Migration } from '@mikro-orm/migrations';

export class Migration20240229083731 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "benchmark" alter column "currency_name" type varchar(100) using ("currency_name"::varchar(100));');

    this.addSql('alter table "user" add column "two-factor_enabled" boolean null default false, add column "two-factor_secret" varchar(255) null;');

    this.addSql('alter table "simulation" alter column "benchmark_currency_name" type varchar(100) using ("benchmark_currency_name"::varchar(100));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "benchmark" alter column "currency_name" type varchar(50) using ("currency_name"::varchar(50));');

    this.addSql('alter table "user" drop column "two-factor_enabled";');
    this.addSql('alter table "user" drop column "two-factor_secret";');

    this.addSql('alter table "simulation" alter column "benchmark_currency_name" type varchar(50) using ("benchmark_currency_name"::varchar(50));');
  }

}
