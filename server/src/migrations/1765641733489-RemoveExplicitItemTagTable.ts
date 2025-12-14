import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveExplicitItemTagTable1765641733489
  implements MigrationInterface
{
  name = 'RemoveExplicitItemTagTable1765641733489';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_tag" DROP CONSTRAINT "FK_66a1d9228911cb932f252a6fd68"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_66a1d9228911cb932f252a6fd6" ON "item_tag" ("fk_item") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0c7a4488ff0d66428a8aeefced" ON "item_tag" ("fk_tag") `,
    );
    await queryRunner.query(
      `ALTER TABLE "item_tag" ADD CONSTRAINT "FK_66a1d9228911cb932f252a6fd68" FOREIGN KEY ("fk_item") REFERENCES "item"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_tag" DROP CONSTRAINT "FK_66a1d9228911cb932f252a6fd68"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0c7a4488ff0d66428a8aeefced"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_66a1d9228911cb932f252a6fd6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_tag" ADD CONSTRAINT "FK_66a1d9228911cb932f252a6fd68" FOREIGN KEY ("fk_item") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
