import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAddressTable1763325951159 implements MigrationInterface {
  name = 'CreateAddressTable1763325951159';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "address" ("id" SERIAL NOT NULL, "country" character varying(255) NOT NULL, "region" character varying(255) NOT NULL, "city" character varying(255) NOT NULL, "street" character varying(255) NOT NULL, "street_number" character varying(255) NOT NULL, "zip_code" character varying(255) NOT NULL, "room_number" character varying(255), "fk_user" integer NOT NULL, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "FK_08ca36829097b08d3b780d4337d" FOREIGN KEY ("fk_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address" DROP CONSTRAINT "FK_08ca36829097b08d3b780d4337d"`,
    );
    await queryRunner.query(`DROP TABLE "address"`);
  }
}
