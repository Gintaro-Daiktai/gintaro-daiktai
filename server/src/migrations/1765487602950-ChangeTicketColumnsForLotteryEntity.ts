import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTicketColumnsForLotteryEntity1765487602950
  implements MigrationInterface
{
  name = 'ChangeTicketColumnsForLotteryEntity1765487602950';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verification_codes" DROP CONSTRAINT "FK_verification_codes_userId"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_verification_codes_userId"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_verification_codes_used"`,
    );
    await queryRunner.query(`ALTER TABLE "lottery" DROP COLUMN "min_bid"`);
    await queryRunner.query(
      `ALTER TABLE "lottery" ADD "ticket_price" numeric(12,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery" ADD "total_tickets" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "verification_codes" ADD CONSTRAINT "FK_9a854eeb4598a22d554ecfe6e81" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "verification_codes" DROP CONSTRAINT "FK_9a854eeb4598a22d554ecfe6e81"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery" DROP COLUMN "total_tickets"`,
    );
    await queryRunner.query(`ALTER TABLE "lottery" DROP COLUMN "ticket_price"`);
    await queryRunner.query(
      `ALTER TABLE "lottery" ADD "min_bid" double precision`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_verification_codes_used" ON "verification_codes" ("used") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_verification_codes_userId" ON "verification_codes" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "verification_codes" ADD CONSTRAINT "FK_verification_codes_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
