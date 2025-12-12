import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProcessedPaymentIdsToUser1765135819659
  implements MigrationInterface
{
  name = 'AddProcessedPaymentIdsToUser1765135819659';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "processedPaymentIds" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "processedPaymentIds"`,
    );
  }
}
