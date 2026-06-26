import 'reflect-metadata';
import { platformDataSource } from './data-source.js';

try {
  await platformDataSource.initialize();
  const migrations = await platformDataSource.runMigrations();
  const names = migrations.map((migration) => migration.name).join(', ');
  console.log(migrations.length > 0 ? `Applied migrations: ${names}` : 'No migrations to apply.');
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  if (platformDataSource.isInitialized) await platformDataSource.destroy();
}
