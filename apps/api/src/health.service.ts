import { Injectable, type OnModuleDestroy } from '@nestjs/common';
import { getReadinessSnapshot } from '@ado/application';
import { TypeOrmDatabaseHealthAdapter } from '@ado/persistence';
import type { HealthResponse } from '@ado/contracts';

@Injectable()
export class HealthService implements OnModuleDestroy {
  private readonly database = new TypeOrmDatabaseHealthAdapter();

  async getHealth(): Promise<HealthResponse> {
    const readiness = await getReadinessSnapshot(this.database);
    return { status: readiness.state, checkedAt: readiness.checkedAt };
  }

  async close(): Promise<void> { await this.database.close(); }

  async onModuleDestroy(): Promise<void> { await this.close(); }
}
