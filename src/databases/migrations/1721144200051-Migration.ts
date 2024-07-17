import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1721144200051 implements MigrationInterface {
    name = 'Migration1721144200051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "text_to_speech" ("id" SERIAL NOT NULL, "audioFileUri" text NOT NULL, "text" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "wordId" uuid, CONSTRAINT "REL_a0695d90090a3223062d8f5c72" UNIQUE ("wordId"), CONSTRAINT "PK_13eb8c24321bed9bd6c9b369ccd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ranking" ALTER COLUMN "score" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "ranking_score_seq"`);
        await queryRunner.query(`ALTER TABLE "ranking" ALTER COLUMN "viewCount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ranking" ALTER COLUMN "addLikeCount" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "text_to_speech" ADD CONSTRAINT "FK_a0695d90090a3223062d8f5c72e" FOREIGN KEY ("wordId") REFERENCES "word"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "text_to_speech" DROP CONSTRAINT "FK_a0695d90090a3223062d8f5c72e"`);
        await queryRunner.query(`ALTER TABLE "ranking" ALTER COLUMN "addLikeCount" SET DEFAULT nextval('ranking_addlikecount_seq')`);
        await queryRunner.query(`ALTER TABLE "ranking" ALTER COLUMN "viewCount" SET DEFAULT nextval('ranking_viewcount_seq')`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "ranking_score_seq" OWNED BY "ranking"."score"`);
        await queryRunner.query(`ALTER TABLE "ranking" ALTER COLUMN "score" SET DEFAULT nextval('"ranking_score_seq"')`);
        await queryRunner.query(`DROP TABLE "text_to_speech"`);
    }

}
