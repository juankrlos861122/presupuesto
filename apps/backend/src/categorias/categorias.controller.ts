import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('categorias')
export class CategoriasController {
  constructor(private categoriasService: CategoriasService) {}

  @Post()
  create(@Request() req, @Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(req.user.userId, createCategoriaDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.categoriasService.findAll(req.user.userId);
  }

  @Get('tipo/:tipo')
  findByTipo(@Request() req, @Param('tipo') tipo: string) {
    return this.categoriasService.findByTipo(req.user.userId, tipo);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.categoriasService.findOne(req.user.userId, parseInt(id));
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateCategoriaDto: any) {
    return this.categoriasService.update(req.user.userId, parseInt(id), updateCategoriaDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.categoriasService.remove(req.user.userId, parseInt(id));
  }
}