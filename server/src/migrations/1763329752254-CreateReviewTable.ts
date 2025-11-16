import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReviewTable1763329752254 implements MigrationInterface {
  name = 'CreateReviewTable1763329752254';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "review" ("id" SERIAL NOT NULL, "title" character varying(255), "body" text, "rating" smallint NOT NULL, "review_date" TIMESTAMP NOT NULL DEFAULT now(), "fk_reviewer" integer NOT NULL, "fk_item" integer NOT NULL, "fk_reviewee" integer NOT NULL, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_72216d8d9d1f83f40b8d983cc4f" FOREIGN KEY ("fk_reviewer") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_654e21af963be36997046142097" FOREIGN KEY ("fk_item") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_3dc6ab1b4a542f60a179d567680" FOREIGN KEY ("fk_reviewee") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_3dc6ab1b4a542f60a179d567680"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_654e21af963be36997046142097"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_72216d8d9d1f83f40b8d983cc4f"`,
    );
    await queryRunner.query(`DROP TABLE "review"`);
  }
}
