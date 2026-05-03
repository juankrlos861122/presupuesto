import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createCategoriaDto: CreateCategoriaDto) {
    return this.prisma.categoria.create({
      data: {
        userId,
        nombre: createCategoriaDto.nombre,
        icono: createCategoriaDto.icono || '💰',
        tipo: createCategoriaDto.tipo,
        esPersonalizada: true,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.categoria.findMany({
      where: {
        OR: [{ userId }, { userId: null }],
      },
      orderBy: [{ tipo: 'asc' }, { nombre: 'asc' }],
    });
  }

  async findByTipo(userId: number, tipo: string) {
    return this.prisma.categoria.findMany({
      where: {
        OR: [{ userId }, { userId: null }],
        tipo,
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(userId: number, id: number) {
    const categoria = await this.prisma.categoria.findFirst({
      where: { id, OR: [{ userId }, { userId: null }] },
    });

    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return categoria;
  }

  async update(userId: number, id: number, updateCategoriaDto: any) {
    const categoria = await this.findOne(userId, id);

    if (!categoria.esPersonalizada) {
      throw new NotFoundException('No se puede modificar una categoría predeterminada');
    }

    return this.prisma.categoria.update({
      where: { id },
      data: updateCategoriaDto,
    });
  }

  async remove(userId: number, id: number) {
    const categoria = await this.findOne(userId, id);

    if (!categoria.esPersonalizada) {
      throw new NotFoundException('No se puede eliminar una categoría predeterminada');
    }

    const transaccionesCount = await this.prisma.transaccion.count({
      where: { categoriaId: id },
    });

    if (transaccionesCount > 0) {
      throw new NotFoundException('No se puede eliminar una categoría con transacciones asociadas');
    }

    await this.prisma.categoria.delete({ where: { id } });
    return { message: 'Categoría eliminada correctamente' };
  }
}