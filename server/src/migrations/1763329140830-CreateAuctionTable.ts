import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuctionTable1763329140830 implements MigrationInterface {
  name = 'CreateAuctionTable1763329140830';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."auction_auction_status_enum" AS ENUM('started', 'sold', 'cancelled', 'created')`,
    );
    await queryRunner.query(
      `CREATE TABLE "auction" ("id" SERIAL NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "min_bid" double precision, "min_increment" double precision, "auction_status" "public"."auction_auction_status_enum" NOT NULL, "fk_user" integer NOT NULL, "fk_item" integer NOT NULL, CONSTRAINT "PK_9dc876c629273e71646cf6dfa67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" ADD CONSTRAINT "FK_beb59164a780e0ca42fa9b1cecd" FOREIGN KEY ("fk_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" ADD CONSTRAINT "FK_107d82f98067417f0a11e1e3017" FOREIGN KEY ("fk_item") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auction" DROP CONSTRAINT "FK_107d82f98067417f0a11e1e3017"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" DROP CONSTRAINT "FK_beb59164a780e0ca42fa9b1cecd"`,
    );
    await queryRunner.query(`DROP TABLE "auction"`);
    await queryRunner.query(`DROP TYPE "public"."auction_auction_status_enum"`);
  }
}
