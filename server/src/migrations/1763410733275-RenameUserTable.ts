import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameUserTable1763410733275 implements MigrationInterface {
  name = 'RenameUserTable1763410733275';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auction_bid" DROP CONSTRAINT "FK_fdcc45c564ecf859108fe1e3291"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" DROP CONSTRAINT "FK_beb59164a780e0ca42fa9b1cecd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_emote" DROP CONSTRAINT "FK_592feea53e1fc922eb4302425d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_72216d8d9d1f83f40b8d983cc4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_3dc6ab1b4a542f60a179d567680"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_a8c947ced171bcc9d2aad76e7bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_ecb3e633fa169050eb479023a95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery" DROP CONSTRAINT "FK_64afd4b039a238bb5cbc8e1e46b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery" DROP CONSTRAINT "FK_8903484e35d9b6f22dfd87c66d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_cbd463b9aca420987187a9066b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery" DROP CONSTRAINT "FK_5e0bcf467a02756c03955b80a8a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery_bid" DROP CONSTRAINT "FK_f127ef8ce5223f3dd327084a3e1"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'client')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "phone_number" character varying(255) NOT NULL, "balance" double precision NOT NULL, "confirmed" boolean NOT NULL DEFAULT false, "registration_date" TIMESTAMP NOT NULL DEFAULT now(), "birth_date" TIMESTAMP NOT NULL, "avatar" bytea, "role" "public"."users_role_enum" NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction_bid" ADD CONSTRAINT "FK_fdcc45c564ecf859108fe1e3291" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" ADD CONSTRAINT "FK_beb59164a780e0ca42fa9b1cecd" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_emote" ADD CONSTRAINT "FK_592feea53e1fc922eb4302425d4" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_72216d8d9d1f83f40b8d983cc4f" FOREIGN KEY ("fk_reviewer") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_3dc6ab1b4a542f60a179d567680" FOREIGN KEY ("fk_reviewee") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_a8c947ced171bcc9d2aad76e7bb" FOREIGN KEY ("fk_sender") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_ecb3e633fa169050eb479023a95" FOREIGN KEY ("fk_receiver") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery" ADD CONSTRAINT "FK_64afd4b039a238bb5cbc8e1e46b" FOREIGN KEY ("fk_sender") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery" ADD CONSTRAINT "FK_8903484e35d9b6f22dfd87c66d1" FOREIGN KEY ("fk_receiver") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_cbd463b9aca420987187a9066b8" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery" ADD CONSTRAINT "FK_5e0bcf467a02756c03955b80a8a" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery_bid" ADD CONSTRAINT "FK_f127ef8ce5223f3dd327084a3e1" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lottery_bid" DROP CONSTRAINT "FK_f127ef8ce5223f3dd327084a3e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery" DROP CONSTRAINT "FK_5e0bcf467a02756c03955b80a8a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" DROP CONSTRAINT "FK_cbd463b9aca420987187a9066b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery" DROP CONSTRAINT "FK_8903484e35d9b6f22dfd87c66d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery" DROP CONSTRAINT "FK_64afd4b039a238bb5cbc8e1e46b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_ecb3e633fa169050eb479023a95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_a8c947ced171bcc9d2aad76e7bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_3dc6ab1b4a542f60a179d567680"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_72216d8d9d1f83f40b8d983cc4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_emote" DROP CONSTRAINT "FK_592feea53e1fc922eb4302425d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" DROP CONSTRAINT "FK_beb59164a780e0ca42fa9b1cecd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction_bid" DROP CONSTRAINT "FK_fdcc45c564ecf859108fe1e3291"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(
      `ALTER TABLE "lottery_bid" ADD CONSTRAINT "FK_f127ef8ce5223f3dd327084a3e1" FOREIGN KEY ("fk_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lottery" ADD CONSTRAINT "FK_5e0bcf467a02756c03955b80a8a" FOREIGN KEY ("fk_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD CONSTRAINT "FK_cbd463b9aca420987187a9066b8" FOREIGN KEY ("fk_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery" ADD CONSTRAINT "FK_8903484e35d9b6f22dfd87c66d1" FOREIGN KEY ("fk_receiver") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "delivery" ADD CONSTRAINT "FK_64afd4b039a238bb5cbc8e1e46b" FOREIGN KEY ("fk_sender") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_ecb3e633fa169050eb479023a95" FOREIGN KEY ("fk_receiver") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_a8c947ced171bcc9d2aad76e7bb" FOREIGN KEY ("fk_sender") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_3dc6ab1b4a542f60a179d567680" FOREIGN KEY ("fk_reviewee") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_72216d8d9d1f83f40b8d983cc4f" FOREIGN KEY ("fk_reviewer") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_emote" ADD CONSTRAINT "FK_592feea53e1fc922eb4302425d4" FOREIGN KEY ("fk_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" ADD CONSTRAINT "FK_beb59164a780e0ca42fa9b1cecd" FOREIGN KEY ("fk_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction_bid" ADD CONSTRAINT "FK_fdcc45c564ecf859108fe1e3291" FOREIGN KEY ("fk_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
