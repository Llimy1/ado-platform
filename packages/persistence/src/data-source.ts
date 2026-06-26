import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { loadEnvironment } from '@ado/config';
import { InitialBootstrapMigration } from './migrations/1735603200000-initial-bootstrap.js';
import { A2OrchestrationDomainMigration } from './migrations/1735689600000-a2-orchestration-domain.js';

const environment = loadEnvironment();

export const platformDataSource = new DataSource({
  type: 'postgres',
  url: environment.ADO_DATABASE_URL,
  synchronize: false,
  migrationsRun: false,
  entities: [],
  migrations: [InitialBootstrapMigration, A2OrchestrationDomainMigration]
});
