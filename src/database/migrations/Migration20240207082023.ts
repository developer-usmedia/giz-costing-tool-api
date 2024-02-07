import { Migration } from '@mikro-orm/migrations';

export class Migration20240207082023 extends Migration {
  
  async up(): Promise<void> {
    this.addSql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    this.addSql('create table "user" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamp not null default now(), "updated_at" timestamp not null default now(), "version" int not null default 1, "first_name" varchar(255) null, "last_name" varchar(255) null, constraint "user_pkey" primary key ("id"));');
  }
}
