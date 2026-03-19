import { Controller, Get, Patch, Delete, Body, Param, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

class PromoteUserDto {
  @ApiProperty({ enum: UserRole })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'List users (admin)' })
  @ApiQuery({ name: 'tenantId', required: false })
  findAll(@Query('tenantId') tenantId?: string) {
    return this.usersService.findAll(tenantId);
  }

  @Get('me/profile')
  @ApiOperation({ summary: 'Get my profile' })
  getProfile(@Request() req: any) {
    return this.usersService.findOne(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ summary: 'Promote/change user role (super-admin or tenant-admin only)' })
  async promoteUser(@Param('id') id: string, @Body() dto: PromoteUserDto, @Request() req: any) {
    // Prevent promoting to SUPER_ADMIN unless caller IS super admin
    if (dto.role === UserRole.SUPER_ADMIN && req.user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admins can create super admins');
    }
    return this.usersService.update(id, { role: dto.role });
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
