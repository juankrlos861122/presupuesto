import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAhorroDto } from './dto/create-ahorro.dto';

@Injectable()
export class AhorrosService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createAhorroDto: CreateAhorroDto) {
    const fecha = new Date(createAhorroDto.fechaObjetivo + 'T12:00:00');
    const ahora = new Date();
    ahora.setHours(23, 59, 59, 999);
    
    if (fecha < ahora) {
      throw new BadRequestException('La fecha objetivo no puede ser menor a la fecha actual');
    }

    return this.prisma.ahorro.create({
      data: {
        userId,
        nombre: createAhorroDto.nombre,
        montoActual: createAhorroDto.montoActual || 0,
        montoObjetivo: createAhorroDto.montoObjetivo,
        fechaObjetivo: new Date(createAhorroDto.fechaObjetivo + 'T12:00:00'),
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.ahorro.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: number, id: number) {
    const ahorro = await this.prisma.ahorro.findFirst({
      where: { id, userId },
    });

    if (!ahorro) {
      throw new NotFoundException('Ahorro no encontrado');
    }

    return ahorro;
  }

  async update(userId: number, id: number, updateAhorroDto: any) {
    await this.findOne(userId, id);

    if (updateAhorroDto.fechaObjetivo) {
      const fecha = new Date(updateAhorroDto.fechaObjetivo + 'T12:00:00');
      const ahora = new Date();
      ahora.setHours(23, 59, 59, 999);
      
      if (fecha < ahora) {
        throw new BadRequestException('La fecha objetivo no puede ser menor a la fecha actual');
      }
    }

    return this.prisma.ahorro.update({
      where: { id },
      data: {
        ...updateAhorroDto,
        fechaObjetivo: updateAhorroDto.fechaObjetivo && updateAhorroDto.fechaObjetivo !== ''
          ? new Date(updateAhorroDto.fechaObjetivo + 'T12:00:00')
          : undefined,
      },
    });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);
    await this.prisma.ahorro.delete({ where: { id } });
    return { message: 'Ahorro eliminado correctamente' };
  }

  async depositar(userId: number, id: number, monto: number, fecha?: string) {
    const ahorro = await this.findOne(userId, id);

    await this.prisma.historialAporte.create({
      data: {
        ahorroId: id,
        monto: monto,
        descripcion: 'Depósito',
        fecha: fecha ? new Date(fecha + 'T12:00:00') : new Date(),
      },
    });

    return this.prisma.ahorro.update({
      where: { id },
      data: {
        montoActual: ahorro.montoActual + monto,
      },
    });
  }

  async getHistorial(userId: number, ahorroId: number) {
    await this.findOne(userId, ahorroId);
    return this.prisma.historialAporte.findMany({
      where: { ahorroId },
      orderBy: { fecha: 'desc' },
    });
  }

  async getResumen(userId: number) {
    const ahorros = await this.prisma.ahorro.findMany({ where: { userId } });

    const totalActual = ahorros.reduce((sum, a) => sum + a.montoActual, 0);
    const totalObjetivo = ahorros.reduce((sum, a) => sum + a.montoObjetivo, 0);

    return {
      totalAhorrado: totalActual,
      totalObjetivo: totalObjetivo,
      porcentajeGeneral: totalObjetivo > 0 ? (totalActual / totalObjetivo) * 100 : 0,
      cantidad: ahorros.length,
      ahorros,
    };
  }
}