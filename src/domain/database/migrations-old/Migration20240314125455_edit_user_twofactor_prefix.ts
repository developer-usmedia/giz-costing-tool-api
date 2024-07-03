import { Migration } from '@mikro-orm/migrations';

export class Migration20240314125455_edit_user_twofactor_prefix extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "giz_user" rename column "two-factor_enabled" to "twofactor_enabled";');
    this.addSql('alter table "giz_user" rename column "two-factor_secret" to "twofactor_secret";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "giz_user" rename column "twofactor_enabled" to "two-factor_enabled";');
    this.addSql('alter table "giz_user" rename column "twofactor_secret" to "two-factor_secret";');
  }

}
