import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeLotteryBidSumToTicketCount1765496597634
  implements MigrationInterface
{
  name = 'ChangeLotteryBidSumToTicketCount1765496597634';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lottery_bid" RENAME COLUMN "sum" TO "ticket_count"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery_bid" DROP COLUMN "ticket_count"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery_bid" ADD "ticket_count" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lottery_bid" DROP COLUMN "ticket_count"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery_bid" ADD "ticket_count" double precision NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery_bid" RENAME COLUMN "ticket_count" TO "sum"`,
    );
  }
}
