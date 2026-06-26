import { ApiProperty } from '@nestjs/swagger';
import type { HealthResponse } from '@ado/contracts';

export class HealthResponseDto implements HealthResponse {
  @ApiProperty({ enum: ['ready', 'unavailable'], example: 'ready' })
  status!: HealthResponse['status'];

  @ApiProperty({ type: String, format: 'date-time', example: '2026-06-24T12:00:00.000Z' })
  checkedAt!: string;
}
