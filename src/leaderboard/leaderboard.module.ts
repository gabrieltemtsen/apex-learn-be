import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardEntry } from '../entities/leaderboard.entity';
import { User } from '../entities/user.entity';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([LeaderboardEntry, User])],
  providers: [LeaderboardService, UsersService],
  controllers: [LeaderboardController],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}
