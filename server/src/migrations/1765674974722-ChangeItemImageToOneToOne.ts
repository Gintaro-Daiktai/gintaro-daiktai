import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeItemImageToOneToOne1765674974722
  implements MigrationInterface
{
  name = 'ChangeItemImageToOneToOne1765674974722';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "image" DROP CONSTRAINT "FK_d2c67b22c45806258b8172f44bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" RENAME COLUMN "fk_item" TO "mimeType"`,
    );
    await queryRunner.query(`ALTER TABLE "item" ADD "fk_image" integer`);
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "UQ_3889e45c1be95450d46ce7f9ac1" UNIQUE ("fk_image")`,
    );
    await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "mimeType"`);
    await queryRunner.query(
      `ALTER TABLE "image" ADD "mimeType" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_3889e45c1be95450d46ce7f9ac1" FOREIGN KEY ("fk_image") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_3889e45c1be95450d46ce7f9ac1"`,
    );
    await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "mimeType"`);
    await queryRunner.query(
      `ALTER TABLE "image" ADD "mimeType" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "UQ_3889e45c1be95450d46ce7f9ac1"`,
    );
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "fk_image"`);
    await queryRunner.query(
      `ALTER TABLE "image" RENAME COLUMN "mimeType" TO "fk_item"`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_d2c67b22c45806258b8172f44bd" FOREIGN KEY ("fk_item") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
