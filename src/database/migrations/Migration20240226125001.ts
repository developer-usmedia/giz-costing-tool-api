import { Migration } from '@mikro-orm/migrations';

export class Migration20240226125001 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "benchmark" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null default now(), "updated_at" timestamp not null default now(), "version" int not null default 1, "year" int not null, "source" varchar(100) null, "country_code" varchar(3) not null, "country_name" varchar(255) not null, "country_locality" varchar(50) not null, "country_region" varchar(100) null, "currency_code" varchar(3) not null, "currency_name" varchar(50) not null, "local_value" numeric(19,4) not null, "eur_value" numeric(19,4) null, "usd_value" numeric(19,4) null, constraint "benchmark_pkey" primary key ("id"));');

    this.addSql('create table "worker" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null default now(), "updated_at" timestamp not null default now(), "version" int not null default 1, "simulation_id" uuid not null, "name" varchar(100) not null, "gender" text check ("gender" in (\'men\', \'women\')) not null, "number_of_workers" int not null default 1, "monthly_wage" int not null, "monthly_bonus" int not null, "percentage_of_year_worked" int not null, "employee_tax" int not null, "employer_tax" int not null, "ikb_food" numeric(19,4) null default 0, "ikb_transportation" numeric(19,4) null default 0, "ikb_housing" numeric(19,4) null default 0, "ikb_healthcare" numeric(19,4) null default 0, "ikb_childcare" numeric(19,4) null default 0, constraint "worker_pkey" primary key ("id"));');

    this.addSql('alter table "worker" add constraint "worker_simulation_id_foreign" foreign key ("simulation_id") references "simulation" ("id") on update cascade;');

    this.addSql('alter table "simulation" drop column "benchmark_name";');
    this.addSql('alter table "simulation" drop column "benchmark_lcu_value";');

    this.addSql('alter table "simulation" add column "benchmark_currency_code" varchar(3) null, add column "benchmark_currency_name" varchar(50) null, add column "benchmark_local_value" numeric(19,4) null;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "benchmark" cascade;');

    this.addSql('drop table if exists "worker" cascade;');

    this.addSql('alter table "simulation" drop column "benchmark_currency_code";');
    this.addSql('alter table "simulation" drop column "benchmark_currency_name";');
    this.addSql('alter table "simulation" drop column "benchmark_local_value";');

    this.addSql('alter table "simulation" add column "benchmark_name" varchar(100) null, add column "benchmark_lcu_value" numeric null;');
  }

}
