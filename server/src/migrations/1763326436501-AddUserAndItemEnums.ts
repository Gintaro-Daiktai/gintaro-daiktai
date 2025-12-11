import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAndItemEnums1763326436501 implements MigrationInterface {
  name = 'AddUserAndItemEnums1763326436501';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "condition"`);
    await queryRunner.query(
      `CREATE TYPE "public"."item_condition_enum" AS ENUM('new', 'used', 'worn', 'broken')`,
    );
    await queryRunner.query(
      `ALTER TABLE "item" ADD "condition" "public"."item_condition_enum" NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'client')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "role" character varying(16) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "item" DROP COLUMN "condition"`);
    await queryRunner.query(`DROP TYPE "public"."item_condition_enum"`);
    await queryRunner.query(
      `ALTER TABLE "item" ADD "condition" character varying NOT NULL`,
    );
  }
}
