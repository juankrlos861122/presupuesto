import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('estadisticas')
  getEstadisticas(@Request() req) {
    return this.dashboardService.getEstadisticas(req.user.userId);
  }

  @Get('graficos')
  getGraficos(@Request() req, @Query('año') año?: string) {
    return this.dashboardService.getGraficos(req.user.userId, año ? parseInt(año) : undefined);
  }
}