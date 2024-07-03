import { Migration } from '@mikro-orm/migrations';

export class Migration20240703113729_UpdatePayrollColumNull extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_scenario" alter column "payroll_num_workers_lwgap" type integer using ("payroll_num_workers_lwgap"::integer);');
    this.addSql('alter table "giz_scenario" alter column "payroll_num_workers_lwgap" drop not null;');
    this.addSql('alter table "giz_scenario" alter column "payroll_avg_lwgap" type numeric(12,4) using ("payroll_avg_lwgap"::numeric(12,4));');
    this.addSql('alter table "giz_scenario" alter column "payroll_avg_lwgap" drop not null;');
    this.addSql('alter table "giz_scenario" alter column "payroll_largest_lwgap" type numeric(12,4) using ("payroll_largest_lwgap"::numeric(12,4));');
    this.addSql('alter table "giz_scenario" alter column "payroll_largest_lwgap" drop not null;');
    this.addSql('alter table "giz_scenario" alter column "payroll_sum_lwgap_allworkers" drop default;');
    this.addSql('alter table "giz_scenario" alter column "payroll_sum_lwgap_allworkers" type numeric(12,4) using ("payroll_sum_lwgap_allworkers"::numeric(12,4));');
    this.addSql('alter table "giz_scenario" alter column "payroll_sum_lwgap_allworkers" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_scenario" alter column "payroll_num_workers_lwgap" type integer using ("payroll_num_workers_lwgap"::integer);');
    this.addSql('alter table "giz_scenario" alter column "payroll_num_workers_lwgap" set not null;');
    this.addSql('alter table "giz_scenario" alter column "payroll_avg_lwgap" type numeric(12,4) using ("payroll_avg_lwgap"::numeric(12,4));');
    this.addSql('alter table "giz_scenario" alter column "payroll_avg_lwgap" set not null;');
    this.addSql('alter table "giz_scenario" alter column "payroll_largest_lwgap" type numeric(12,4) using ("payroll_largest_lwgap"::numeric(12,4));');
    this.addSql('alter table "giz_scenario" alter column "payroll_largest_lwgap" set not null;');
    this.addSql('alter table "giz_scenario" alter column "payroll_sum_lwgap_allworkers" type numeric(12,4) using ("payroll_sum_lwgap_allworkers"::numeric(12,4));');
    this.addSql('alter table "giz_scenario" alter column "payroll_sum_lwgap_allworkers" set default 0;');
    this.addSql('alter table "giz_scenario" alter column "payroll_sum_lwgap_allworkers" set not null;');
  }

}
