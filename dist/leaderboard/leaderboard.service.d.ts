import { Repository } from 'typeorm';
import { LeaderboardEntry } from '../entities/leaderboard.entity';
export declare class LeaderboardService {
    private leaderboardRepo;
    constructor(leaderboardRepo: Repository<LeaderboardEntry>);
    getRankings(tenantId: string, period?: string): Promise<LeaderboardEntry[]>;
    updateUserPoints(userId: string, tenantId: string, points: number, period?: string): Promise<void>;
    incrementCoursesCompleted(userId: string, tenantId: string): Promise<void>;
    private recomputeRanks;
}
