import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { TransaccionesService } from './transacciones.service';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('transacciones')
export class TransaccionesController {
  constructor(private transaccionesService: TransaccionesService) {}

  @Post()
  create(@Request() req, @Body() createTransaccionDto: CreateTransaccionDto) {
    return this.transaccionesService.create(req.user.userId, createTransaccionDto);
  }

  @Get()
  findAll(@Request() req, @Query('mes') mes?: string, @Query('año') año?: string, @Query('tipo') tipo?: string) {
    return this.transaccionesService.findAll(req.user.userId, {
      mes: mes ? parseInt(mes) : undefined,
      año: año ? parseInt(año) : undefined,
      tipo,
    });
  }

  @Get('resumen')
  getResumen(@Request() req, @Query('mes') mes?: string, @Query('año') año?: string) {
    return this.transaccionesService.getResumen(
      req.user.userId,
      mes ? parseInt(mes) : undefined,
      año ? parseInt(año) : undefined,
    );
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.transaccionesService.findOne(req.user.userId, parseInt(id));
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateTransaccionDto: any) {
    return this.transaccionesService.update(req.user.userId, parseInt(id), updateTransaccionDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.transaccionesService.remove(req.user.userId, parseInt(id));
  }
}