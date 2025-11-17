import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeAvatarNullable1763409637611 implements MigrationInterface {
  name = 'MakeAvatarNullable1763409637611';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "avatar" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "avatar" SET NOT NULL`,
    );
  }
}
