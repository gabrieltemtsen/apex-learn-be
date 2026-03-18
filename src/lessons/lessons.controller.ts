import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@ApiTags('lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get lessons for a course' })
  findByCourse(@Param('courseId') courseId: string) {
    return this.lessonsService.findByCourse(courseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson by id' })
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FACILITATOR, UserRole.ADMIN, UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create lesson' })
  create(@Body() dto: CreateLessonDto) {
    return this.lessonsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.FACILITATOR, UserRole.ADMIN, UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lesson' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateLessonDto>) {
    return this.lessonsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete lesson' })
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
