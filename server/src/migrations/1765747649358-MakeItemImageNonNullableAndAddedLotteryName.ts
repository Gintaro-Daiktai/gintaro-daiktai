import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeItemImageNonNullableAndAddedLotteryName1765747649358
  implements MigrationInterface
{
  name = 'MakeItemImageNonNullableAndAddedLotteryName1765747649358';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lottery" ADD "name" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_3889e45c1be95450d46ce7f9ac1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "fk_image" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_3889e45c1be95450d46ce7f9ac1" FOREIGN KEY ("fk_image") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_3889e45c1be95450d46ce7f9ac1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ALTER COLUMN "fk_image" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_3889e45c1be95450d46ce7f9ac1" FOREIGN KEY ("fk_image") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "lottery" DROP COLUMN "name"`);
  }
}
