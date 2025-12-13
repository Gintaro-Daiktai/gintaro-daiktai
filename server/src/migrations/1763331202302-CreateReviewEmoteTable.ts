import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReviewEmoteTable1763331202302 implements MigrationInterface {
  name = 'CreateReviewEmoteTable1763331202302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."review_emote_emote_enum" AS ENUM('like', 'dislike', 'smile', 'sad', 'angry', 'fire', 'joy', 'heart', 'six_seven', 'mantas')`,
    );
    await queryRunner.query(
      `CREATE TABLE "review_emote" ("id" SERIAL NOT NULL, "emote" "public"."review_emote_emote_enum" NOT NULL, "fk_review" integer NOT NULL, "fk_user" integer NOT NULL, CONSTRAINT "PK_6bf8a6aa5f7e6e4d323aad3125d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_emote" ADD CONSTRAINT "FK_4929b9f4e9b6be7d915e4cd679a" FOREIGN KEY ("fk_review") REFERENCES "review"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_emote" ADD CONSTRAINT "FK_592feea53e1fc922eb4302425d4" FOREIGN KEY ("fk_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "review_emote" DROP CONSTRAINT "FK_592feea53e1fc922eb4302425d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_emote" DROP CONSTRAINT "FK_4929b9f4e9b6be7d915e4cd679a"`,
    );
    await queryRunner.query(`DROP TABLE "review_emote"`);
    await queryRunner.query(`DROP TYPE "public"."review_emote_emote_enum"`);
  }
}
