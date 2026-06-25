import type { HealthState } from '@ado/domain';
export interface HealthResponse { readonly status: HealthState; readonly checkedAt: string; }
