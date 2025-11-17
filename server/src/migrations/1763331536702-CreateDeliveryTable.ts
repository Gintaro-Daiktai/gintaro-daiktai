import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDeliveryTable1763331536702 implements MigrationInterface {
  name = 'CreateDeliveryTable1763331536702';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."delivery_order_status_enum" AS ENUM('processing', 'delivering', 'delivered', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "delivery" ("id" SERIAL NOT NULL, "order_date" TIMESTAMP NOT NULL DEFAULT now(), "order_status" "public"."delivery_order_status_enum" NOT NULL, "fk_item" integer NOT NULL, "fk_sender" integer NOT NULL, "fk_receiver" integer NOT NULL, CONSTRAINT "PK_ffad7bf84e68716cd9af89003b0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery" ADD CONSTRAINT "FK_135a872e543ec20236c53fee8a2" FOREIGN KEY ("fk_item") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery" ADD CONSTRAINT "FK_64afd4b039a238bb5cbc8e1e46b" FOREIGN KEY ("fk_sender") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery" ADD CONSTRAINT "FK_8903484e35d9b6f22dfd87c66d1" FOREIGN KEY ("fk_receiver") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "delivery" DROP CONSTRAINT "FK_8903484e35d9b6f22dfd87c66d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery" DROP CONSTRAINT "FK_64afd4b039a238bb5cbc8e1e46b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery" DROP CONSTRAINT "FK_135a872e543ec20236c53fee8a2"`,
    );
    await queryRunner.query(`DROP TABLE "delivery"`);
    await queryRunner.query(`DROP TYPE "public"."delivery_order_status_enum"`);
  }
}
