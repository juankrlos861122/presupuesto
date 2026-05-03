import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ObjetivosService } from './objetivos.service';
import { CreateObjetivoDto } from './dto/create-objetivo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('objetivos')
export class ObjetivosController {
  constructor(private objetivosService: ObjetivosService) {}

  @Post()
  create(@Request() req, @Body() createObjetivoDto: CreateObjetivoDto) {
    return this.objetivosService.create(req.user.userId, createObjetivoDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.objetivosService.findAll(req.user.userId);
  }

  @Get('progreso')
  getProgreso(@Request() req) {
    return this.objetivosService.getProgreso(req.user.userId);
  }

  @Get('alertas')
  getAlertas(@Request() req) {
    return this.objetivosService.getAlertas(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.objetivosService.findOne(req.user.userId, parseInt(id));
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateObjetivoDto: any) {
    return this.objetivosService.update(req.user.userId, parseInt(id), updateObjetivoDto);
  }

  @Get(':id/historial')
  getHistorial(@Request() req, @Param('id') id: string) {
    return this.objetivosService.getHistorial(req.user.userId, parseInt(id));
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.objetivosService.remove(req.user.userId, parseInt(id));
  }
}