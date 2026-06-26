export type HealthState = 'ready' | 'unavailable';
export interface ReadinessSnapshot { readonly state: HealthState; readonly checkedAt: string; }
