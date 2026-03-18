import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { LeaderboardService } from './leaderboard.service';

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get(':tenantId')
  @ApiOperation({ summary: 'Get leaderboard for a tenant' })
  @ApiQuery({ name: 'period', required: false, enum: ['weekly', 'monthly', 'all_time'] })
  getRankings(@Param('tenantId') tenantId: string, @Query('period') period?: string) {
    return this.leaderboardService.getRankings(tenantId, period || 'all_time');
  }
}
