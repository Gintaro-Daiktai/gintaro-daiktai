import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVerificationCodesTable1732233000000
  implements MigrationInterface
{
  name = 'CreateVerificationCodesTable1732233000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "verification_codes" (
        "id" SERIAL NOT NULL,
        "userId" integer NOT NULL,
        "code" character varying(6) NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "attempts" integer NOT NULL DEFAULT 0,
        "used" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_verification_codes" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "verification_codes"
      ADD CONSTRAINT "FK_verification_codes_userId"
      FOREIGN KEY ("userId")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_verification_codes_userId" ON "verification_codes" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_verification_codes_used" ON "verification_codes" ("used")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_verification_codes_used"`);
    await queryRunner.query(`DROP INDEX "IDX_verification_codes_userId"`);
    await queryRunner.query(
      `ALTER TABLE "verification_codes" DROP CONSTRAINT "FK_verification_codes_userId"`,
    );
    await queryRunner.query(`DROP TABLE "verification_codes"`);
  }
}
