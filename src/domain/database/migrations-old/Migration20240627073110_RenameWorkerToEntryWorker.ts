import { Migration } from '@mikro-orm/migrations';

export class Migration20240627073110_RenameWorkerToEntryWorker extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_worker" rename to "giz_entry_worker";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_entry_worker" rename to "giz_worker";');
  }

}
