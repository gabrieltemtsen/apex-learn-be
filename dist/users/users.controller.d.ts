import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(tenantId?: string): Promise<import("../entities/user.entity").User[]>;
    getProfile(req: any): Promise<import("../entities/user.entity").User>;
    findOne(id: string): Promise<import("../entities/user.entity").User>;
    update(id: string, dto: UpdateUserDto): Promise<import("../entities/user.entity").User>;
    remove(id: string): Promise<void>;
}
