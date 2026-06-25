import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialBootstrapMigration implements MigrationInterface {
  name = 'InitialBootstrapMigration1735603200000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE IF NOT EXISTS platform_bootstrap_metadata (id smallint PRIMARY KEY CHECK (id = 1), created_at timestamptz NOT NULL DEFAULT now())');
    await queryRunner.query('INSERT INTO platform_bootstrap_metadata (id) VALUES (1) ON CONFLICT (id) DO NOTHING');
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS platform_bootstrap_metadata');
  }
}
