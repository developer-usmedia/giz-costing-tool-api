import { Migration } from '@mikro-orm/migrations';

export class Migration20240628104431_ScenarioWorkerModel extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "giz_scenario_worker" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null default now(), "updated_at" timestamp not null default now(), "version" int not null default 1, "scenario_id" uuid not null, "original_id" uuid not null, "remuneration_increase" numeric(12,4) null, constraint "giz_scenario_worker_pkey" primary key ("id"));');

    this.addSql('alter table "giz_scenario_worker" add constraint "giz_scenario_worker_scenario_id_foreign" foreign key ("scenario_id") references "giz_scenario" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "giz_scenario_worker" add constraint "giz_scenario_worker_original_id_foreign" foreign key ("original_id") references "giz_entry_worker" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "giz_entry" alter column "benchmark_local_value" type numeric(19,4) using ("benchmark_local_value"::numeric(19,4));');
    this.addSql('update "giz_entry" set "benchmark_local_value" = 0 where "benchmark_local_value" is null;');
    this.addSql('alter table "giz_entry" alter column "benchmark_local_value" set not null;');

    this.addSql('alter table "giz_scenario" add column "average_lw_gap" numeric(19,4) null, add column "largest_lw_gap" numeric(19,4) null;');

    this.addSql('alter table "giz_entry_worker" add column "ikb_child_education" numeric(12,4) not null default 0;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_food" drop default;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_food" type numeric(12,4) using ("ikb_food"::numeric(12,4));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_food" set not null;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_transportation" drop default;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_transportation" type numeric(12,4) using ("ikb_transportation"::numeric(12,4));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_transportation" set not null;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_housing" drop default;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_housing" type numeric(12,4) using ("ikb_housing"::numeric(12,4));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_housing" set not null;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_healthcare" drop default;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_healthcare" type numeric(12,4) using ("ikb_healthcare"::numeric(12,4));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_healthcare" set not null;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_childcare" drop default;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_childcare" type numeric(12,4) using ("ikb_childcare"::numeric(12,4));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_childcare" set not null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "giz_scenario_worker" cascade;');

    this.addSql('alter table "giz_entry" alter column "benchmark_local_value" type numeric(19,4) using ("benchmark_local_value"::numeric(19,4));');
    this.addSql('alter table "giz_entry" alter column "benchmark_local_value" drop not null;');

    this.addSql('alter table "giz_scenario" drop column "average_lw_gap";');
    this.addSql('alter table "giz_scenario" drop column "largest_lw_gap";');

    this.addSql('alter table "giz_entry_worker" drop column "ikb_child_education";');

    this.addSql('alter table "giz_entry_worker" alter column "ikb_food" type numeric(19,4) using ("ikb_food"::numeric(19,4));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_food" set default 0;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_food" drop not null;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_transportation" type numeric(19,4) using ("ikb_transportation"::numeric(19,4));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_transportation" set default 0;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_transportation" drop not null;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_housing" type numeric(19,4) using ("ikb_housing"::numeric(19,4));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_housing" set default 0;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_housing" drop not null;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_healthcare" type numeric(19,4) using ("ikb_healthcare"::numeric(19,4));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_healthcare" set default 0;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_healthcare" drop not null;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_childcare" type numeric(19,4) using ("ikb_childcare"::numeric(19,4));');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_childcare" set default 0;');
    this.addSql('alter table "giz_entry_worker" alter column "ikb_childcare" drop not null;');
  }

}
