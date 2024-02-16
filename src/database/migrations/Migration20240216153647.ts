import { Migration } from '@mikro-orm/migrations';

export class Migration20240216153647 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "simulation" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null default now(), "updated_at" timestamp not null default now(), "version" int not null default 1, "name" varchar(100) not null, "year" int not null, "user_id" uuid not null, "status" text check ("status" in (\'open\', \'finalized\')) not null default \'open\', "facility_name" varchar(100) null, "facility_id" varchar(255) null, "facility_country_code" varchar(2) null, "facility_currency_code" varchar(3) null, "facility_sector" varchar(100) null, "facility_product" varchar(255) null, "facility_unit_of_production" varchar(50) null, "facility_annual_production" integer null, "benchmark_name" varchar(100) null, "benchmark_year" int null, "benchmark_source" varchar(100) null, "benchmark_locality" varchar(50) null, "benchmark_region" varchar(50) null, "benchmark_lcu_value" numeric null, constraint "simulation_pkey" primary key ("id"));');

    this.addSql('alter table "simulation" add constraint "simulation_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "simulation" cascade;');
  }

}
