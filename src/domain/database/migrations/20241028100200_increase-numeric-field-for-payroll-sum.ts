import { Migration } from '@mikro-orm/migrations';

export class Migration20241028100200_IncreaseNumericFieldForPayrollSum extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_entry" alter column "payroll_sum_lwgap_allworkers" type numeric(16,4) using ("payroll_sum_lwgap_allworkers"::numeric(16,4));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_entry" alter column "payroll_sum_lwgap_allworkers" type numeric(12,4) using ("payroll_sum_lwgap_allworkers"::numeric(12,4));');
  }

}
