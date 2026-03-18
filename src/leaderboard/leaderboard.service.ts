import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaderboardEntry } from '../entities/leaderboard.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(LeaderboardEntry)
    private leaderboardRepo: Repository<LeaderboardEntry>,
  ) {}

  async getRankings(tenantId: string, period: string = 'all_time'): Promise<LeaderboardEntry[]> {
    return this.leaderboardRepo.find({
      where: { tenantId, period },
      relations: ['user'],
      order: { points: 'DESC' },
      take: 100,
    });
  }

  async updateUserPoints(userId: string, tenantId: string, points: number, period: string = 'all_time'): Promise<void> {
    let entry = await this.leaderboardRepo.findOne({ where: { userId, tenantId, period } });

    if (entry) {
      await this.leaderboardRepo.update(entry.id, {
        points: entry.points + points,
      });
    } else {
      entry = this.leaderboardRepo.create({ userId, tenantId, points, period });
      await this.leaderboardRepo.save(entry);
    }

    await this.recomputeRanks(tenantId, period);
  }

  async incrementCoursesCompleted(userId: string, tenantId: string): Promise<void> {
    const entry = await this.leaderboardRepo.findOne({ where: { userId, tenantId, period: 'all_time' } });
    if (entry) {
      await this.leaderboardRepo.increment({ id: entry.id }, 'coursesCompleted', 1);
    }
  }

  private async recomputeRanks(tenantId: string, period: string): Promise<void> {
    const entries = await this.leaderboardRepo.find({
      where: { tenantId, period },
      order: { points: 'DESC' },
    });
    for (let i = 0; i < entries.length; i++) {
      await this.leaderboardRepo.update(entries[i].id, { rank: i + 1 });
    }
  }
}
