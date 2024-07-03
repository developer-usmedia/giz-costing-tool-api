import { Migration } from '@mikro-orm/migrations';

export class Migration20240301121431_add_sessions_table extends Migration {
    async up(): Promise<void> {
        this.addSql('CREATE TABLE IF NOT EXISTS "giz_session" ("sid" varchar NOT NULL COLLATE "default", "sess" json NOT NULL, "expire" timestamp(6) NOT NULL, CONSTRAINT "giz_session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE) WITH (OIDS=FALSE);');
        this.addSql('CREATE INDEX IF NOT EXISTS "giz_session_expire" ON "giz_session" ("expire");');
    }

    async down(): Promise<void> {
        this.addSql('DROP TABLE "giz_session"')
        this.addSql('DROP INDEX "giz_session_expire"')
    }
}
