import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private notificacionesService: NotificacionesService) {}

  @Get('alertas')
  getAlertas(@Request() req) {
    return this.notificacionesService.getAlertas(req.user.userId);
  }

  @Get('configuracion')
  getConfiguracion(@Request() req) {
    return this.notificacionesService.getConfiguracion(req.user.userId);
  }

  @Put('configuracion')
  updateConfiguracion(@Request() req, @Body() config: any) {
    return this.notificacionesService.updateConfiguracion(req.user.userId, config);
  }
}