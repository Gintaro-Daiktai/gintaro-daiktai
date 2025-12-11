import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChargeBackRequestTable1763332093535
  implements MigrationInterface
{
  name = 'CreateChargeBackRequestTable1763332093535';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chargeback_request" ("id" SERIAL NOT NULL, "reason" text NOT NULL, "confirmed" boolean NOT NULL, "fk_delivery" integer NOT NULL, CONSTRAINT "PK_4bf5843bc2b715da481789c41a5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "chargeback_request" ADD CONSTRAINT "FK_a83fad9902f21e2b8b4e6812a44" FOREIGN KEY ("fk_delivery") REFERENCES "delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chargeback_request" DROP CONSTRAINT "FK_a83fad9902f21e2b8b4e6812a44"`,
    );
    await queryRunner.query(`DROP TABLE "chargeback_request"`);
  }
}
