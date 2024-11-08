import { Migration } from '@mikro-orm/migrations';

export class Migration20241107135802_AddCountryCodeToFacility extends Migration {

  async up(): Promise<void> {
    // Create facility_country_code column and fill it
    this.addSql('alter table "giz_entry" add column "facility_country_code" varchar(2) null;');
    this.addSql('update "giz_entry" set "facility_country_code"=\'CN\' where "facility__country"=\'China\'');
    this.addSql('update "giz_entry" set "facility_country_code"=\'CO\' where "facility__country"=\'Colombia\'');
    this.addSql('update "giz_entry" set "facility_country_code"=\'CR\' where "facility__country"=\'Costa Rica\'');
    this.addSql('update "giz_entry" set "facility_country_code"=\'DO\' where "facility__country"=\'Dominican Republic\'');
    this.addSql('update "giz_entry" set "facility_country_code"=\'EC\' where "facility__country"=\'Ecuador\'');
    this.addSql('update "giz_entry" set "facility_country_code"=\'GT\' where "facility__country"=\'Guatemala\'');
    this.addSql('update "giz_entry" set "facility_country_code"=\'MZ\' where "facility__country"=\'Mozambique\'');
    this.addSql('update "giz_entry" set "facility_country_code"=\'NL\' where "facility__country"=\'Netherlands\'');
    this.addSql('update "giz_entry" set "facility_country_code"=\'NI\' where "facility__country"=\'Nicaragua\'');
    this.addSql('update "giz_entry" set "facility_country_code"=\'US\' where "facility__country"=\'United States\'');
    this.addSql('update "giz_entry" set "facility_country_code"=\'CA\' where "facility__country"=\'Canada\'');
    this.addSql('update "giz_entry" set "facility_country_code"=\'PE\' where "facility__country"=\'Peru\'');
    this.addSql('update "giz_entry" set "facility_country_code"=\'TH\' where "facility__country"=\'Thailand\'');
    this.addSql('update "giz_entry" set "facility_country_code"=\'VN\' where "facility__country"=\'Vietnam\'');
    this.addSql('alter table "giz_entry" alter column "facility_country_code" set not null;');

    // Create benchmark_country_code column and fill it
    this.addSql('alter table "giz_entry" add column "benchmark_country_code" varchar(2) null;');
    this.addSql('update "giz_entry" set "benchmark_country_code"=\'CN\' where "facility__country"=\'China\'');
    this.addSql('update "giz_entry" set "benchmark_country_code"=\'CO\' where "facility__country"=\'Colombia\'');
    this.addSql('update "giz_entry" set "benchmark_country_code"=\'CR\' where "facility__country"=\'Costa Rica\'');
    this.addSql('update "giz_entry" set "benchmark_country_code"=\'DO\' where "facility__country"=\'Dominican Republic\'');
    this.addSql('update "giz_entry" set "benchmark_country_code"=\'EC\' where "facility__country"=\'Ecuador\'');
    this.addSql('update "giz_entry" set "benchmark_country_code"=\'GT\' where "facility__country"=\'Guatemala\'');
    this.addSql('update "giz_entry" set "benchmark_country_code"=\'MZ\' where "facility__country"=\'Mozambique\'');
    this.addSql('update "giz_entry" set "benchmark_country_code"=\'NL\' where "facility__country"=\'Netherlands\'');
    this.addSql('update "giz_entry" set "benchmark_country_code"=\'NI\' where "facility__country"=\'Nicaragua\'');
    this.addSql('update "giz_entry" set "benchmark_country_code"=\'US\' where "facility__country"=\'United States\'');
    this.addSql('update "giz_entry" set "benchmark_country_code"=\'CA\' where "facility__country"=\'Canada\'');
    this.addSql('update "giz_entry" set "benchmark_country_code"=\'PE\' where "facility__country"=\'Peru\'');
    this.addSql('update "giz_entry" set "benchmark_country_code"=\'TH\' where "facility__country"=\'Thailand\'');
    this.addSql('update "giz_entry" set "benchmark_country_code"=\'VN\' where "facility__country"=\'Vietnam\'');
    this.addSql('alter table "giz_entry" alter column "benchmark_country_code" set not null;');

    // Drop old columns
    this.addSql('alter table "giz_entry" drop column "facility__country";');
    this.addSql('alter table "giz_entry" drop column "benchmark__country";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_entry" drop column "facility_country_code";');
    this.addSql('alter table "giz_entry" drop column "benchmark_country_code";');

    this.addSql('alter table "giz_entry" add column "facility__country" varchar(255) not null default \'\';');
    this.addSql('alter table "giz_entry" add column "benchmark__country" varchar(255) not null default \'\';');
  }

}
