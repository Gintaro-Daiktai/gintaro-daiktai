import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLotteryTable1763327932316 implements MigrationInterface {
  name = 'CreateLotteryTable1763327932316';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."lottery_lottery_status_enum" AS ENUM('created', 'started', 'sold out', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "lottery" ("id" SERIAL NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "min_bid" double precision, "lottery_status" "public"."lottery_lottery_status_enum" NOT NULL, CONSTRAINT "PK_3c80b07e70c62d855b3ebfdd3ce" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "lottery"`);
    await queryRunner.query(`DROP TYPE "public"."lottery_lottery_status_enum"`);
  }
}
