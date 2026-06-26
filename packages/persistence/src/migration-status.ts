import 'reflect-metadata';
import { platformDataSource } from './data-source.js';

try {
  await platformDataSource.initialize();
  const hasPendingMigrations = await platformDataSource.showMigrations();
  console.log(hasPendingMigrations ? 'Pending migrations exist.' : 'No pending migrations.');
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  if (platformDataSource.isInitialized) await platformDataSource.destroy();
}
