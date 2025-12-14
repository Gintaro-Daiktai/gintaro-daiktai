import { MigrationInterface, QueryRunner } from 'typeorm';

export class LotteryEnumUpdate1765732070342 implements MigrationInterface {
  name = 'LotteryEnumUpdate1765732070342';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."lottery_lottery_status_enum" RENAME TO "lottery_lottery_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."lottery_lottery_status_enum" AS ENUM('created', 'started', 'sold out', 'cancelled', 'finished')`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery" ALTER COLUMN "lottery_status" TYPE "public"."lottery_lottery_status_enum" USING "lottery_status"::"text"::"public"."lottery_lottery_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."lottery_lottery_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_58c6dbc7c705524cdcdd1ab4045" FOREIGN KEY ("fk_lottery") REFERENCES "lottery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_58c6dbc7c705524cdcdd1ab4045"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."lottery_lottery_status_enum_old" AS ENUM('created', 'started', 'sold out', 'cancelled')`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery" ALTER COLUMN "lottery_status" TYPE "public"."lottery_lottery_status_enum_old" USING "lottery_status"::"text"::"public"."lottery_lottery_status_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."lottery_lottery_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."lottery_lottery_status_enum_old" RENAME TO "lottery_lottery_status_enum"`,
    );
  }
}
