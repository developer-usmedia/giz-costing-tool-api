import { Migration } from '@mikro-orm/migrations';
export class Migration20241128174802_UseCappedIkbOnly extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "giz_entry_worker" drop column "ikb_housing";');
        this.addSql('alter table "giz_entry_worker" drop column "ikb_food";');
        this.addSql('alter table "giz_entry_worker" drop column "ikb_transport";');
        this.addSql('alter table "giz_entry_worker" drop column "ikb_healthcare";');
        this.addSql('alter table "giz_entry_worker" drop column "ikb_childcare";');
        this.addSql('alter table "giz_entry_worker" drop column "ikb_child_education";');
    }

    async down(): Promise<void> {
        this.addSql('alter table "giz_entry_worker" add column "ikb_housing" numeric(14,2) not null default 0;');
        this.addSql('alter table "giz_entry_worker" add column "ikb_food" numeric(14,2) not null default 0;');
        this.addSql('alter table "giz_entry_worker" add column "ikb_transport" numeric(14,2) not null default 0;');
        this.addSql('alter table "giz_entry_worker" add column "ikb_healthcare" numeric(14,2) not null default 0;');
        this.addSql('alter table "giz_entry_worker" add column "ikb_childcare" numeric(14,2) not null default 0;');
        this.addSql('alter table "giz_entry_worker" add column "ikb_child_education" numeric(14,2) not null default 0;');

        // Setting ikb back on ikb_housing, just so calculations of ikb totals stay the same.
        // But yes there is data loss - since we don't know which ikbs the total was composed of.
        this.addSql('update "giz_entry_worker" set "ikb_housing" = COALESCE("ikb_housing", "ikb");');
    }
}
