import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { LeaderboardService } from './leaderboard.service';
import { UsersService } from '../users/users.service';

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private leaderboardService: LeaderboardService,
    private usersService: UsersService,
  ) {}

  @Get('top')
  @ApiOperation({ summary: 'Global top learners ranked by points (no tenant required)' })
  @ApiQuery({ name: 'limit', required: false })
  async getTopLearners(@Query('limit') limit?: string) {
    const users = await this.usersService.getTopByPoints(limit ? parseInt(limit) : 50);
    return users.map((u, i) => ({
      rank: i + 1,
      userId: u.id,
      name: `${u.firstName} ${u.lastName}`,
      avatarUrl: u.avatarUrl,
      points: u.points ?? 0,
      streak: u.streak ?? 0,
    }));
  }

  @Get(':tenantId')
  @ApiOperation({ summary: 'Get leaderboard for a specific tenant' })
  @ApiQuery({ name: 'period', required: false, enum: ['weekly', 'monthly', 'all_time'] })
  getRankings(@Param('tenantId') tenantId: string, @Query('period') period?: string) {
    return this.leaderboardService.getRankings(tenantId, period || 'all_time');
  }
}
