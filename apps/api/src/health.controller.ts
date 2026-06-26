import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { HealthResponse } from '@ado/contracts';
import { HealthResponseDto } from './health-response.dto.js';
import { HealthService } from './health.service.js';

@ApiTags('health')
@Controller('v1')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Report API liveness and database readiness.' })
  @ApiOkResponse({ description: 'A transport-safe readiness snapshot.', type: HealthResponseDto })
  async getHealth(): Promise<HealthResponse> { return this.healthService.getHealth(); }
}
