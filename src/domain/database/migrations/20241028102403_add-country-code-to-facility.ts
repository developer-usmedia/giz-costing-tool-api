import { Migration } from '@mikro-orm/migrations';

export class Migration20241028102403_AddCountryCodeToFacility extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_entry" add column "facility_country_code" varchar(3) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_entry" drop column "facility_country_code";');
  }

}
