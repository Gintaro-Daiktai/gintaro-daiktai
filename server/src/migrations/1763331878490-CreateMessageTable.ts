import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMessageTable1763331878490 implements MigrationInterface {
  name = 'CreateMessageTable1763331878490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "message" ("id" SERIAL NOT NULL, "text" text NOT NULL, "send_date" TIMESTAMP NOT NULL DEFAULT now(), "fk_sender" integer NOT NULL, "fk_receiver" integer NOT NULL, "fk_message" integer, "fk_delivery" integer NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_a8c947ced171bcc9d2aad76e7bb" FOREIGN KEY ("fk_sender") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_ecb3e633fa169050eb479023a95" FOREIGN KEY ("fk_receiver") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_aea7b22bf910cd6a6510adae81c" FOREIGN KEY ("fk_message") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_12a8d6dfffbdc93994f5f64460f" FOREIGN KEY ("fk_delivery") REFERENCES "delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_12a8d6dfffbdc93994f5f64460f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_aea7b22bf910cd6a6510adae81c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_ecb3e633fa169050eb479023a95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_a8c947ced171bcc9d2aad76e7bb"`,
    );
    await queryRunner.query(`DROP TABLE "message"`);
  }
}
