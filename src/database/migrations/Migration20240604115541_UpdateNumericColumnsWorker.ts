import { Migration } from '@mikro-orm/migrations';

export class Migration20240604115541_UpdateNumericColumnsWorker extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_worker" alter column "number_of_workers" type numeric(6,0) using ("number_of_workers"::numeric(6,0));');
    this.addSql('alter table "giz_worker" alter column "monthly_wage" type numeric(8,2) using ("monthly_wage"::numeric(8,2));');
    this.addSql('alter table "giz_worker" alter column "monthly_bonus" type numeric(8,2) using ("monthly_bonus"::numeric(8,2));');
    this.addSql('alter table "giz_worker" alter column "percentage_of_year_worked" type numeric(5,2) using ("percentage_of_year_worked"::numeric(5,2));');
    this.addSql('alter table "giz_worker" alter column "employee_tax" type numeric(5,2) using ("employee_tax"::numeric(5,2));');
    this.addSql('alter table "giz_worker" alter column "employer_tax" type numeric(5,2) using ("employer_tax"::numeric(5,2));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_worker" alter column "number_of_workers" type int using ("number_of_workers"::int);');
    this.addSql('alter table "giz_worker" alter column "monthly_wage" type int using ("monthly_wage"::int);');
    this.addSql('alter table "giz_worker" alter column "monthly_bonus" type int using ("monthly_bonus"::int);');
    this.addSql('alter table "giz_worker" alter column "percentage_of_year_worked" type int using ("percentage_of_year_worked"::int);');
    this.addSql('alter table "giz_worker" alter column "employee_tax" type int using ("employee_tax"::int);');
    this.addSql('alter table "giz_worker" alter column "employer_tax" type int using ("employer_tax"::int);');
  }

}
