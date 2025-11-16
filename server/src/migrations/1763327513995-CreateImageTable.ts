import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateImageTable1763327513995 implements MigrationInterface {
  name = 'CreateImageTable1763327513995';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "image" ("id" SERIAL NOT NULL, "image" bytea NOT NULL, "fk_item" integer NOT NULL, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_d2c67b22c45806258b8172f44bd" FOREIGN KEY ("fk_item") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "image" DROP CONSTRAINT "FK_d2c67b22c45806258b8172f44bd"`,
    );
    await queryRunner.query(`DROP TABLE "image"`);
  }
}
