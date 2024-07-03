import { Migration } from '@mikro-orm/migrations';

export class Migration20240325184310_refactor_simulation_status_values extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_simulation" drop constraint if exists "giz_simulation_status_check";');

    this.addSql('alter table "giz_simulation" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "giz_simulation" add constraint "giz_simulation_status_check" check ("status" in (\'STATUS_OPEN\', \'STATUS_FINALIZED\'));');
    this.addSql('alter table "giz_simulation" alter column "status" set default \'STATUS_OPEN\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_simulation" drop constraint if exists "giz_simulation_status_check";');

    this.addSql('alter table "giz_simulation" alter column "status" type text using ("status"::text);');
    this.addSql('alter table "giz_simulation" add constraint "giz_simulation_status_check" check ("status" in (\'open\', \'finalized\'));');
    this.addSql('alter table "giz_simulation" alter column "status" set default \'open\';');
  }

}
