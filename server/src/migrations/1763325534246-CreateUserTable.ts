import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1763325534246 implements MigrationInterface {
  name = 'CreateUserTable1763325534246';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "phone_number" character varying(255) NOT NULL, "balance" double precision NOT NULL, "confirmed" boolean NOT NULL DEFAULT false, "registration_date" TIMESTAMP NOT NULL DEFAULT now(), "birth_date" TIMESTAMP NOT NULL, "avatar" bytea NOT NULL, "role" character varying(16) NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
