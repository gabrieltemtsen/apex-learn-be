import { User } from './user.entity';
import { Tenant } from './tenant.entity';
export declare class LeaderboardEntry {
    id: string;
    userId: string;
    user: User;
    tenantId: string;
    tenant: Tenant;
    points: number;
    rank: number;
    period: string;
    coursesCompleted: number;
    assessmentsPassed: number;
    updatedAt: Date;
    createdAt: Date;
}
