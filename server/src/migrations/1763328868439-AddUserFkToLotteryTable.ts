import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserFkToLotteryTable1763328868439
  implements MigrationInterface
{
  name = 'AddUserFkToLotteryTable1763328868439';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lottery" ADD "fk_user" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery" ADD CONSTRAINT "FK_5e0bcf467a02756c03955b80a8a" FOREIGN KEY ("fk_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lottery" DROP CONSTRAINT "FK_5e0bcf467a02756c03955b80a8a"`,
    );
    await queryRunner.query(`ALTER TABLE "lottery" DROP COLUMN "fk_user"`);
  }
}
