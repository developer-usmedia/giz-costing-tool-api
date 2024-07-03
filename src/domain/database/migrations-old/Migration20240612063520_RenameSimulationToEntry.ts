import { Migration } from '@mikro-orm/migrations';

export class Migration20240612063520_RenameSimulationToEntry extends Migration {
    async up(): Promise<void> {
        // Rename simulation -> worker constraint
        this.addSql('ALTER TABLE "giz_worker" RENAME CONSTRAINT "giz_worker_simulation_id_foreign" TO "giz_worker_entry_id_foreign"');

        // Rename column id. (Should update constratint)
        this.addSql('ALTER TABLE "giz_worker" RENAME COLUMN "simulation_id" TO "entry_id"');

        // Rename table
        this.addSql('ALTER TABLE "giz_simulation" RENAME TO "giz_entry"');
    }

    async down(): Promise<void> {
        // Rename table back to its original name
        this.addSql('ALTER TABLE "giz_entry" RENAME TO "giz_simulation"');

        // Rename column back to its original name (Should update constraint)
        this.addSql('ALTER TABLE "giz_worker" RENAME COLUMN "entry_id" TO "simulation_id"');

        // Rename constraint back to its original name
        this.addSql('ALTER TABLE "giz_worker" RENAME CONSTRAINT "giz_worker_entry_id_foreign" TO "giz_worker_simulation_id_foreign"');
    }
}
