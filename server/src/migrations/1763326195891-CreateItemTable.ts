import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateItemTable1763326195891 implements MigrationInterface {
  name = 'CreateItemTable1763326195891';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "item" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "creation_date" TIMESTAMP NOT NULL DEFAULT now(), "view_count" integer NOT NULL DEFAULT 0, "weight" double precision, "length" double precision, "width" double precision, "height" double precision, "condition" character varying NOT NULL, "fk_lottery" integer, "fk_user" integer NOT NULL, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_cbd463b9aca420987187a9066b8" FOREIGN KEY ("fk_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_cbd463b9aca420987187a9066b8"`,
    );
    await queryRunner.query(`DROP TABLE "item"`);
  }
}
