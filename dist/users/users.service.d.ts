import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private userRepo;
    constructor(userRepo: Repository<User>);
    findAll(tenantId?: string): Promise<User[]>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    create(data: Partial<User>): Promise<User>;
    update(id: string, dto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    updateRefreshToken(id: string, refreshToken: string | null): Promise<void>;
    updateLastLogin(id: string): Promise<void>;
    updatePoints(id: string, points: number): Promise<void>;
}
