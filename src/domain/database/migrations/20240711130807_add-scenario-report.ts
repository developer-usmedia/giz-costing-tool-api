import { Migration } from '@mikro-orm/migrations';

export class Migration20240711130807_AddScenarioReport extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_scenario" add column "report_remuneration_increase" numeric(14,4) null, add column "report_tax_costs" numeric(14,4) null, add column "report_overhead_costs" numeric(14,4) null, add column "report_total_costs" numeric(14,4) null, add column "report_total_costs_per_unit" numeric(14,4) null;');
    this.addSql('alter table "giz_scenario" add column "report__calculated_at" timestamp null default now();');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_scenario" drop column "report_remuneration_increase";');
    this.addSql('alter table "giz_scenario" drop column "report_tax_costs";');
    this.addSql('alter table "giz_scenario" drop column "report_overhead_costs";');
    this.addSql('alter table "giz_scenario" drop column "report_total_costs";');
    this.addSql('alter table "giz_scenario" drop column "report_total_costs_per_unit";');
    this.addSql('alter table "giz_scenario" drop column "report__calculated_at";');
  }

}
