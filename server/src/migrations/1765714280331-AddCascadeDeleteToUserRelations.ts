import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeleteToUserRelations1765714280331 implements MigrationInterface {
    name = 'AddCascadeDeleteToUserRelations1765714280331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auction_bid" DROP CONSTRAINT "FK_fdcc45c564ecf859108fe1e3291"`);
        await queryRunner.query(`ALTER TABLE "auction" DROP CONSTRAINT "FK_beb59164a780e0ca42fa9b1cecd"`);
        await queryRunner.query(`ALTER TABLE "review_emote" DROP CONSTRAINT "FK_592feea53e1fc922eb4302425d4"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_72216d8d9d1f83f40b8d983cc4f"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_3dc6ab1b4a542f60a179d567680"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_a8c947ced171bcc9d2aad76e7bb"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_ecb3e633fa169050eb479023a95"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP CONSTRAINT "FK_64afd4b039a238bb5cbc8e1e46b"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP CONSTRAINT "FK_8903484e35d9b6f22dfd87c66d1"`);
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_cbd463b9aca420987187a9066b8"`);
        await queryRunner.query(`ALTER TABLE "lottery" DROP CONSTRAINT "FK_5e0bcf467a02756c03955b80a8a"`);
        await queryRunner.query(`ALTER TABLE "lottery_bid" DROP CONSTRAINT "FK_f127ef8ce5223f3dd327084a3e1"`);
        await queryRunner.query(`ALTER TABLE "auction_bid" ADD CONSTRAINT "FK_fdcc45c564ecf859108fe1e3291" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auction" ADD CONSTRAINT "FK_beb59164a780e0ca42fa9b1cecd" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review_emote" ADD CONSTRAINT "FK_592feea53e1fc922eb4302425d4" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_72216d8d9d1f83f40b8d983cc4f" FOREIGN KEY ("fk_reviewer") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_3dc6ab1b4a542f60a179d567680" FOREIGN KEY ("fk_reviewee") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_a8c947ced171bcc9d2aad76e7bb" FOREIGN KEY ("fk_sender") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_ecb3e633fa169050eb479023a95" FOREIGN KEY ("fk_receiver") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD CONSTRAINT "FK_64afd4b039a238bb5cbc8e1e46b" FOREIGN KEY ("fk_sender") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD CONSTRAINT "FK_8903484e35d9b6f22dfd87c66d1" FOREIGN KEY ("fk_receiver") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_cbd463b9aca420987187a9066b8" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lottery" ADD CONSTRAINT "FK_5e0bcf467a02756c03955b80a8a" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lottery_bid" ADD CONSTRAINT "FK_f127ef8ce5223f3dd327084a3e1" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lottery_bid" DROP CONSTRAINT "FK_f127ef8ce5223f3dd327084a3e1"`);
        await queryRunner.query(`ALTER TABLE "lottery" DROP CONSTRAINT "FK_5e0bcf467a02756c03955b80a8a"`);
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_cbd463b9aca420987187a9066b8"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP CONSTRAINT "FK_8903484e35d9b6f22dfd87c66d1"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP CONSTRAINT "FK_64afd4b039a238bb5cbc8e1e46b"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_ecb3e633fa169050eb479023a95"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_a8c947ced171bcc9d2aad76e7bb"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_3dc6ab1b4a542f60a179d567680"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_72216d8d9d1f83f40b8d983cc4f"`);
        await queryRunner.query(`ALTER TABLE "review_emote" DROP CONSTRAINT "FK_592feea53e1fc922eb4302425d4"`);
        await queryRunner.query(`ALTER TABLE "auction" DROP CONSTRAINT "FK_beb59164a780e0ca42fa9b1cecd"`);
        await queryRunner.query(`ALTER TABLE "auction_bid" DROP CONSTRAINT "FK_fdcc45c564ecf859108fe1e3291"`);
        await queryRunner.query(`ALTER TABLE "lottery_bid" ADD CONSTRAINT "FK_f127ef8ce5223f3dd327084a3e1" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lottery" ADD CONSTRAINT "FK_5e0bcf467a02756c03955b80a8a" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_cbd463b9aca420987187a9066b8" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD CONSTRAINT "FK_8903484e35d9b6f22dfd87c66d1" FOREIGN KEY ("fk_receiver") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD CONSTRAINT "FK_64afd4b039a238bb5cbc8e1e46b" FOREIGN KEY ("fk_sender") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_ecb3e633fa169050eb479023a95" FOREIGN KEY ("fk_receiver") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_a8c947ced171bcc9d2aad76e7bb" FOREIGN KEY ("fk_sender") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_3dc6ab1b4a542f60a179d567680" FOREIGN KEY ("fk_reviewee") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_72216d8d9d1f83f40b8d983cc4f" FOREIGN KEY ("fk_reviewer") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review_emote" ADD CONSTRAINT "FK_592feea53e1fc922eb4302425d4" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auction" ADD CONSTRAINT "FK_beb59164a780e0ca42fa9b1cecd" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auction_bid" ADD CONSTRAINT "FK_fdcc45c564ecf859108fe1e3291" FOREIGN KEY ("fk_user") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
