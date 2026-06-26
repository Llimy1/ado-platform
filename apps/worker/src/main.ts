import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { loadEnvironment } from '@ado/config';
import { TypeOrmDatabaseHealthAdapter } from '@ado/persistence';
import { WorkerModule } from './worker.module.js';

async function bootstrap(): Promise<void> {
  loadEnvironment();
  const context = await NestFactory.createApplicationContext(WorkerModule, { logger: ['error', 'warn', 'log'] });
  const database = new TypeOrmDatabaseHealthAdapter();
  await database.check();
  const keepAlive = setInterval(() => undefined, 60_000);
  await new Promise<void>((resolve, reject) => {
    let closing = false;
    const close = async (): Promise<void> => {
      if (closing) return;
      closing = true;
      clearInterval(keepAlive);
      try {
        await database.close();
        await context.close();
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    process.once('SIGTERM', () => void close());
    process.once('SIGINT', () => void close());
  });
}

void bootstrap().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
