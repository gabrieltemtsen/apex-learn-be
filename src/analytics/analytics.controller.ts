import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('tenant/:tenantId/overview')
  @ApiOperation({ summary: 'Get tenant analytics overview' })
  getTenantOverview(@Param('tenantId') tenantId: string) {
    return this.analyticsService.getTenantOverview(tenantId);
  }

  @Get('tenant/:tenantId/learner-activity')
  @ApiOperation({ summary: 'Get learner activity for a tenant' })
  getLearnerActivity(@Param('tenantId') tenantId: string) {
    return this.analyticsService.getLearnerActivity(tenantId);
  }

  @Get('course/:courseId/stats')
  @ApiOperation({ summary: 'Get statistics for a course' })
  getCourseStats(@Param('courseId') courseId: string) {
    return this.analyticsService.getCourseStats(courseId);
  }
}
