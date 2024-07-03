import { Migration } from '@mikro-orm/migrations';

export class Migration20240624085323_AddCountryToFacility extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_entry" add column "facility_country" varchar(255) null;');
    this.addSql('alter table "giz_entry" alter column "facility_country_code" type varchar(3) using ("facility_country_code"::varchar(3));');
    this.addSql('alter table "giz_entry" alter column "facility_country_code" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_entry" drop column "facility_country";');

    this.addSql('alter table "giz_entry" alter column "facility_country_code" type varchar(3) using ("facility_country_code"::varchar(3));');
    this.addSql('alter table "giz_entry" alter column "facility_country_code" set not null;');
  }

}
