import { Migration } from '@mikro-orm/migrations';

export class Migration20240307153923_patch_simulation extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_user" drop column "first_name";');
    this.addSql('alter table "giz_user" drop column "last_name";');

    this.addSql('alter table "giz_simulation" drop column "name";');
    this.addSql('alter table "giz_simulation" drop column "facility_sector";');

    this.addSql('alter table "giz_simulation" add column "facility_buyer_name" varchar(255) null, add column "facility_buyer_proportion" int null, add column "default_employer_tax" numeric(19,4) null default 0, add column "default_employee_tax" numeric(19,4) null default 0, add column "administrative_costs" numeric(19,4) null default 0;');
    this.addSql('alter table "giz_simulation" alter column "facility_name" type varchar(100) using ("facility_name"::varchar(100));');
    this.addSql('alter table "giz_simulation" alter column "facility_name" set not null;');
    this.addSql('alter table "giz_simulation" alter column "facility_country_code" type varchar(3) using ("facility_country_code"::varchar(3));');
    this.addSql('alter table "giz_simulation" alter column "facility_country_code" set not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_user" add column "first_name" varchar(255) null, add column "last_name" varchar(255) null;');

    this.addSql('alter table "giz_simulation" drop column "facility_buyer_name";');
    this.addSql('alter table "giz_simulation" drop column "facility_buyer_proportion";');
    this.addSql('alter table "giz_simulation" drop column "default_employer_tax";');
    this.addSql('alter table "giz_simulation" drop column "default_employee_tax";');
    this.addSql('alter table "giz_simulation" drop column "administrative_costs";');

    this.addSql('alter table "giz_simulation" add column "name" varchar(100) not null, add column "facility_sector" varchar(100) null;');
    this.addSql('alter table "giz_simulation" alter column "facility_name" type varchar(100) using ("facility_name"::varchar(100));');
    this.addSql('alter table "giz_simulation" alter column "facility_name" drop not null;');
    this.addSql('alter table "giz_simulation" alter column "facility_country_code" type varchar(2) using ("facility_country_code"::varchar(2));');
    this.addSql('alter table "giz_simulation" alter column "facility_country_code" drop not null;');
  }

}
