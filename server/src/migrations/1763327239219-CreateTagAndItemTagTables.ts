import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTagAndItemTagTables1763327239219
  implements MigrationInterface
{
  name = 'CreateTagAndItemTagTables1763327239219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"), CONSTRAINT "UQ_tag_name" UNIQUE ("name"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item_tag" ("fk_tag" integer NOT NULL, "fk_item" integer NOT NULL, CONSTRAINT "PK_67a789a9e51d67b4afa43cc7487" PRIMARY KEY ("fk_tag", "fk_item"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_tag" ADD CONSTRAINT "FK_0c7a4488ff0d66428a8aeefcedd" FOREIGN KEY ("fk_tag") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_tag" ADD CONSTRAINT "FK_66a1d9228911cb932f252a6fd68" FOREIGN KEY ("fk_item") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_tag" DROP CONSTRAINT "FK_66a1d9228911cb932f252a6fd68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_tag" DROP CONSTRAINT "FK_0c7a4488ff0d66428a8aeefcedd"`,
    );
    await queryRunner.query(`DROP TABLE "item_tag"`);
    await queryRunner.query(`DROP TABLE "tag"`);
  }
}
