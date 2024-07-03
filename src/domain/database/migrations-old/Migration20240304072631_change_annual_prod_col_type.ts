import { Migration } from '@mikro-orm/migrations';

export class Migration20240304072631_change_annual_prod_col_type extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_simulation" alter column "facility_annual_production" type numeric(19,4) using ("facility_annual_production"::numeric(19,4));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_simulation" alter column "facility_annual_production" type integer using ("facility_annual_production"::integer);');
  }

}
