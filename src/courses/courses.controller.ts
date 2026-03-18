import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'List courses with filters' })
  @ApiQuery({ name: 'tenantId', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('tenantId') tenantId?: string,
    @Query('category') category?: string,
    @Query('level') level?: string,
    @Query('search') search?: string,
  ) {
    return this.coursesService.findAll({ tenantId, category, level, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by id' })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FACILITATOR, UserRole.ADMIN, UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a course' })
  create(@Body() dto: CreateCourseDto, @Request() req: any) {
    return this.coursesService.create(dto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FACILITATOR, UserRole.ADMIN, UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a course' })
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a course' })
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FACILITATOR, UserRole.ADMIN, UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a course' })
  publish(@Param('id') id: string) {
    return this.coursesService.publish(id);
  }
}
