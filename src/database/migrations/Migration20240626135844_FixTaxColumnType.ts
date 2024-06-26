import { Migration } from '@mikro-orm/migrations';

export class Migration20240626135844_FixTaxColumnType extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_scenario" alter column "specification_employee_tax" type numeric(5,2) using ("specification_employee_tax"::numeric(5,2));');
    this.addSql('alter table "giz_scenario" alter column "specification_employer_tax" type numeric(5,2) using ("specification_employer_tax"::numeric(5,2));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_scenario" alter column "specification_employee_tax" type numeric(3,2) using ("specification_employee_tax"::numeric(3,2));');
    this.addSql('alter table "giz_scenario" alter column "specification_employer_tax" type numeric(3,2) using ("specification_employer_tax"::numeric(3,2));');
  }

}
