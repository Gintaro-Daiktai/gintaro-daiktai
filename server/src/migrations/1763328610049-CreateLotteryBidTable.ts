import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLotteryBidTable1763328610049 implements MigrationInterface {
  name = 'CreateLotteryBidTable1763328610049';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "lottery_bid" ("id" SERIAL NOT NULL, "sum" double precision NOT NULL, "bid_date" TIMESTAMP NOT NULL, "fk_user" integer NOT NULL, "fk_lottery" integer NOT NULL, CONSTRAINT "PK_cde69ac367f07219d7f9352a156" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery_bid" ADD CONSTRAINT "FK_f127ef8ce5223f3dd327084a3e1" FOREIGN KEY ("fk_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery_bid" ADD CONSTRAINT "FK_8618988fc60a34307dc5c300212" FOREIGN KEY ("fk_lottery") REFERENCES "lottery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lottery_bid" DROP CONSTRAINT "FK_8618988fc60a34307dc5c300212"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery_bid" DROP CONSTRAINT "FK_f127ef8ce5223f3dd327084a3e1"`,
    );
    await queryRunner.query(`DROP TABLE "lottery_bid"`);
  }
}
