import { Migration } from '@mikro-orm/migrations';

export class Migration20240703111521_AddBuyerUnit extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_entry" alter column "buyer__unit" type text using ("buyer__unit"::text);');
    this.addSql('alter table "giz_entry" add constraint "giz_entry_buyer__unit_check" check ("buyer__unit" in (\'MEN\', \'WOMEN\'));');

    this.addSql('alter table "giz_scenario" rename column "specs_additional_costs" to "specs_overhead_costs";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_entry" drop constraint if exists "giz_entry_buyer__unit_check";');

    this.addSql('alter table "giz_entry" alter column "buyer__unit" type varchar(255) using ("buyer__unit"::varchar(255));');

    this.addSql('alter table "giz_scenario" rename column "specs_overhead_costs" to "specs_additional_costs";');
  }

}
