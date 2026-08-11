import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1786482539978 implements MigrationInterface {
  name = 'CreateUsersTable1786482539978';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // gen_random_uuid() is native to Postgres 13+ (pgcrypto folded into
    // core), so no CREATE EXTENSION is needed — unlike the generator's
    // default uuid_generate_v4(), which requires "uuid-ossp".
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users"  ("email") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
