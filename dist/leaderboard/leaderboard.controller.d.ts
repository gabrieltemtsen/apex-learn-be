import { LeaderboardService } from './leaderboard.service';
export declare class LeaderboardController {
    private leaderboardService;
    constructor(leaderboardService: LeaderboardService);
    getRankings(tenantId: string, period?: string): Promise<import("../entities/leaderboard.entity").LeaderboardEntry[]>;
}
