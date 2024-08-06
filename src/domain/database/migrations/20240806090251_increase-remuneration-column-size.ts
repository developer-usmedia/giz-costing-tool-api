import { Migration } from '@mikro-orm/migrations';

export class Migration20240806090251_IncreaseRemunerationColumnSize extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_entry_worker" alter column "base_wage" type numeric(14,4) using ("base_wage"::numeric(14,4));');
    this.addSql('alter table "giz_entry_worker" alter column "bonuses" type numeric(14,4) using ("bonuses"::numeric(14,4));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb" type numeric(14,4) using ("ikb"::numeric(14,4));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_housing" type numeric(14,4) using ("ikb_housing"::numeric(14,4));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_food" type numeric(14,4) using ("ikb_food"::numeric(14,4));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_transport" type numeric(14,4) using ("ikb_transport"::numeric(14,4));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_healthcare" type numeric(14,4) using ("ikb_healthcare"::numeric(14,4));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_childcare" type numeric(14,4) using ("ikb_childcare"::numeric(14,4));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_child_education" type numeric(14,4) using ("ikb_child_education"::numeric(14,4));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_entry_worker" alter column "base_wage" type numeric(12,2) using ("base_wage"::numeric(12,2));');
    this.addSql('alter table "giz_entry_worker" alter column "bonuses" type numeric(12,2) using ("bonuses"::numeric(12,2));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb" type numeric(12,2) using ("ikb"::numeric(12,2));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_housing" type numeric(12,2) using ("ikb_housing"::numeric(12,2));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_food" type numeric(12,2) using ("ikb_food"::numeric(12,2));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_transport" type numeric(12,2) using ("ikb_transport"::numeric(12,2));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_healthcare" type numeric(12,2) using ("ikb_healthcare"::numeric(12,2));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_childcare" type numeric(12,2) using ("ikb_childcare"::numeric(12,2));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_child_education" type numeric(12,2) using ("ikb_child_education"::numeric(12,2));');
  }

}
