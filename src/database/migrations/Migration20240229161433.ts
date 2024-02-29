import { Migration } from '@mikro-orm/migrations';

export class Migration20240229161433 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "simulation" drop constraint "simulation_user_id_foreign";');

    this.addSql('alter table "worker" drop constraint "worker_simulation_id_foreign";');

    this.addSql('alter table "simulation" add constraint "simulation_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "worker" add constraint "worker_simulation_id_foreign" foreign key ("simulation_id") references "simulation" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "simulation" drop constraint "simulation_user_id_foreign";');

    this.addSql('alter table "worker" drop constraint "worker_simulation_id_foreign";');

    this.addSql('alter table "simulation" add constraint "simulation_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "worker" add constraint "worker_simulation_id_foreign" foreign key ("simulation_id") references "simulation" ("id") on update cascade;');
  }

}
