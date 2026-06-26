import type { DatabaseHealthPort } from '@ado/application';
import { platformDataSource } from './data-source.js';

export class TypeOrmDatabaseHealthAdapter implements DatabaseHealthPort {
  private initialization?: Promise<typeof platformDataSource>;

  async check(): Promise<void> {
    if (!platformDataSource.isInitialized) {
      this.initialization ??= platformDataSource.initialize().finally(() => { this.initialization = undefined; });
      await this.initialization;
    }
    await platformDataSource.query('SELECT 1');
  }
  async close(): Promise<void> {
    if (this.initialization) await this.initialization.catch(() => undefined);
    if (platformDataSource.isInitialized) { await platformDataSource.destroy(); }
  }
}

export { platformDataSource };
