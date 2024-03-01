import { Migration } from '@mikro-orm/migrations';

export class Migration20240301082721_initial extends Migration {

  async up(): Promise<void> {
    this.addSql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'); // Fix UUID error
    this.addSql('create table "giz_benchmark" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null default now(), "updated_at" timestamp not null default now(), "version" int not null default 1, "year" int not null, "source" varchar(100) null, "country_code" varchar(3) not null, "country_name" varchar(255) not null, "country_locality" varchar(50) not null, "country_region" varchar(100) null, "currency_code" varchar(3) not null, "currency_name" varchar(100) not null, "local_value" numeric(19,4) not null, "eur_value" numeric(19,4) null, "usd_value" numeric(19,4) null, constraint "giz_benchmark_pkey" primary key ("id"));');

    this.addSql('create table "giz_user" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null default now(), "updated_at" timestamp not null default now(), "version" int not null default 1, "email" varchar(255) not null, "first_name" varchar(255) null, "last_name" varchar(255) null, "password" varchar(255) not null, "salt" varchar(255) not null, "email_verfied" boolean not null default false, "verification_code" varchar(6) null, "verification_expires_at" timestamptz null, "two-factor_enabled" boolean null default false, "two-factor_secret" varchar(255) null, constraint "giz_user_pkey" primary key ("id"));');
    this.addSql('alter table "giz_user" add constraint "giz_user_email_unique" unique ("email");');

    this.addSql('create table "giz_simulation" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null default now(), "updated_at" timestamp not null default now(), "version" int not null default 1, "name" varchar(100) not null, "year" int not null, "user_id" uuid not null, "status" text check ("status" in (\'open\', \'finalized\')) not null default \'open\', "facility_name" varchar(100) null, "facility_id" varchar(255) null, "facility_country_code" varchar(2) null, "facility_currency_code" varchar(3) null, "facility_sector" varchar(100) null, "facility_product" varchar(255) null, "facility_unit_of_production" varchar(50) null, "facility_annual_production" integer null, "benchmark_year" int null, "benchmark_source" varchar(100) null, "benchmark_locality" varchar(50) null, "benchmark_region" varchar(50) null, "benchmark_currency_code" varchar(3) null, "benchmark_currency_name" varchar(100) null, "benchmark_local_value" numeric(19,4) null, constraint "giz_simulation_pkey" primary key ("id"));');

    this.addSql('create table "giz_worker" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null default now(), "updated_at" timestamp not null default now(), "version" int not null default 1, "simulation_id" uuid not null, "name" varchar(100) not null, "gender" text check ("gender" in (\'men\', \'women\')) not null, "number_of_workers" int not null default 1, "monthly_wage" int not null, "monthly_bonus" int not null, "percentage_of_year_worked" int not null, "employee_tax" int not null, "employer_tax" int not null, "ikb_food" numeric(19,4) null default 0, "ikb_transportation" numeric(19,4) null default 0, "ikb_housing" numeric(19,4) null default 0, "ikb_healthcare" numeric(19,4) null default 0, "ikb_childcare" numeric(19,4) null default 0, constraint "giz_worker_pkey" primary key ("id"));');

    this.addSql('alter table "giz_simulation" add constraint "giz_simulation_user_id_foreign" foreign key ("user_id") references "giz_user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "giz_worker" add constraint "giz_worker_simulation_id_foreign" foreign key ("simulation_id") references "giz_simulation" ("id") on update cascade on delete cascade;');
  }

}
