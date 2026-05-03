import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AhorrosService } from './ahorros.service';
import { CreateAhorroDto } from './dto/create-ahorro.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ahorros')
export class AhorrosController {
  constructor(private ahorrosService: AhorrosService) {}

  @Post()
  create(@Request() req, @Body() createAhorroDto: CreateAhorroDto) {
    return this.ahorrosService.create(req.user.userId, createAhorroDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.ahorrosService.findAll(req.user.userId);
  }

  @Get('resumen')
  getResumen(@Request() req) {
    return this.ahorrosService.getResumen(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.ahorrosService.findOne(req.user.userId, parseInt(id));
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateAhorroDto: any) {
    return this.ahorrosService.update(req.user.userId, parseInt(id), updateAhorroDto);
  }

  @Put(':id/depositar')
  depositar(@Request() req, @Param('id') id: string, @Body() body: { monto: number; fecha?: string }) {
    return this.ahorrosService.depositar(req.user.userId, parseInt(id), body.monto, body.fecha);
  }

  @Get(':id/historial')
  getHistorial(@Request() req, @Param('id') id: string) {
    return this.ahorrosService.getHistorial(req.user.userId, parseInt(id));
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.ahorrosService.remove(req.user.userId, parseInt(id));
  }
}