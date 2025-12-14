import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCascadeDeleteToChargebackRequest1765714445982
  implements MigrationInterface
{
  name = 'AddCascadeDeleteToChargebackRequest1765714445982';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chargeback_request" DROP CONSTRAINT "FK_a83fad9902f21e2b8b4e6812a44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chargeback_request" ADD CONSTRAINT "FK_a83fad9902f21e2b8b4e6812a44" FOREIGN KEY ("fk_delivery") REFERENCES "delivery"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chargeback_request" DROP CONSTRAINT "FK_a83fad9902f21e2b8b4e6812a44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chargeback_request" ADD CONSTRAINT "FK_a83fad9902f21e2b8b4e6812a44" FOREIGN KEY ("fk_delivery") REFERENCES "delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
