import { Migration } from '@mikro-orm/migrations';

export class Migration20240710122118_UpdateEntryBuyerUnitEnum extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_entry" drop constraint if exists "giz_entry_buyer__unit_check";');

    this.addSql('alter table "giz_entry" alter column "buyer__unit" type text using ("buyer__unit"::text);');
    this.addSql('alter table "giz_entry" add constraint "giz_entry_buyer__unit_check" check ("buyer__unit" in (\'UNIT\', \'PERCENTAGE\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_entry" drop constraint if exists "giz_entry_buyer__unit_check";');

    this.addSql('alter table "giz_entry" alter column "buyer__unit" type text using ("buyer__unit"::text);');
    this.addSql('alter table "giz_entry" add constraint "giz_entry_buyer__unit_check" check ("buyer__unit" in (\'MEN\', \'WOMEN\'));');
  }

}
