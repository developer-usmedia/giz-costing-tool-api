import { Migration } from '@mikro-orm/migrations';

export class Migration20240626125925_AddScenario extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "giz_scenario" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null default now(), "updated_at" timestamp not null default now(), "version" int not null default 1, "entry_id" uuid not null, "type" text check ("type" in (\'TYPE_CLOSE_GAP\', \'TYPE_ABSOLUTE_INCREASE\')) not null, "specification_employee_tax" numeric(3,2) not null default 0, "specification_employer_tax" numeric(3,2) not null default 0, "specification_absolute_increase" numeric(19,4) not null default 0, constraint "giz_scenario_pkey" primary key ("id"));');
    this.addSql('alter table "giz_scenario" add constraint "giz_scenario_entry_id_unique" unique ("entry_id");');

    this.addSql('alter table "giz_scenario" add constraint "giz_scenario_entry_id_foreign" foreign key ("entry_id") references "giz_entry" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "giz_entry" add column "average_lw_gap" numeric(19,4) null, add column "largest_lw_gap" numeric(19,4) null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "giz_scenario" cascade;');

    this.addSql('alter table "giz_entry" drop column "average_lw_gap";');
    this.addSql('alter table "giz_entry" drop column "largest_lw_gap";');
  }

}
