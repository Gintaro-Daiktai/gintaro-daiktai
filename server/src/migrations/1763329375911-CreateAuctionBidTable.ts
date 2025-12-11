import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuctionBidTable1763329375911 implements MigrationInterface {
  name = 'CreateAuctionBidTable1763329375911';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auction_bid" ("id" SERIAL NOT NULL, "sum" double precision NOT NULL, "bid_date" TIMESTAMP NOT NULL DEFAULT now(), "fk_auction" integer NOT NULL, "fk_user" integer NOT NULL, CONSTRAINT "PK_bb11c1cfa7707fac20673b28ef5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction_bid" ADD CONSTRAINT "FK_b3925c73ba1984e36f4d8e95d15" FOREIGN KEY ("fk_auction") REFERENCES "auction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction_bid" ADD CONSTRAINT "FK_fdcc45c564ecf859108fe1e3291" FOREIGN KEY ("fk_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auction_bid" DROP CONSTRAINT "FK_fdcc45c564ecf859108fe1e3291"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction_bid" DROP CONSTRAINT "FK_b3925c73ba1984e36f4d8e95d15"`,
    );
    await queryRunner.query(`DROP TABLE "auction_bid"`);
  }
}
