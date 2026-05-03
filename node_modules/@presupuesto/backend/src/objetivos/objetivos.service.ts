import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateObjetivoDto } from './dto/create-objetivo.dto';

@Injectable()
export class ObjetivosService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createObjetivoDto: CreateObjetivoDto) {
    return this.prisma.objetivo.create({
      data: {
        userId,
        nombre: createObjetivoDto.nombre,
        montoObjetivo: createObjetivoDto.montoObjetivo,
        montoActual: createObjetivoDto.montoActual || 0,
        categoriaId: createObjetivoDto.categoriaId || null,
        fechaLimite: new Date(createObjetivoDto.fechaLimite),
        notificaciones: createObjetivoDto.notificaciones ?? true,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.objetivo.findMany({
      where: { userId },
      include: { categoria: true },
      orderBy: { fechaLimite: 'asc' },
    });
  }

  async findOne(userId: number, id: number) {
    const objetivo = await this.prisma.objetivo.findFirst({
      where: { id, userId },
      include: { categoria: true },
    });

    if (!objetivo) {
      throw new NotFoundException('Objetivo no encontrado');
    }

    return objetivo;
  }

  async update(userId: number, id: number, updateObjetivoDto: any) {
    const objetivo = await this.findOne(userId, id);

    if (updateObjetivoDto.montoActual && updateObjetivoDto.montoActual > objetivo.montoActual) {
      const aporte = updateObjetivoDto.montoActual - objetivo.montoActual;
      await this.prisma.historialAporte.create({
        data: {
          objetivoId: id,
          monto: aporte,
          descripcion: 'Aporte',
          fecha: updateObjetivoDto.fechaAporte ? new Date(updateObjetivoDto.fechaAporte + 'T12:00:00') : new Date(),
        },
      });
      delete updateObjetivoDto.fechaAporte;
    }

    if (updateObjetivoDto.montoActual && updateObjetivoDto.montoActual >= updateObjetivoDto.montoObjetivo) {
      updateObjetivoDto.completado = true;
    }

    return this.prisma.objetivo.update({
      where: { id },
      data: updateObjetivoDto,
      include: { categoria: true },
    });
  }

  async getHistorial(userId: number, objetivoId: number) {
    await this.findOne(userId, objetivoId);
    return this.prisma.historialAporte.findMany({
      where: { objetivoId },
      orderBy: { fecha: 'desc' },
    });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);
    await this.prisma.objetivo.delete({ where: { id } });
    return { message: 'Objetivo eliminado correctamente' };
  }

  async getProgreso(userId: number) {
    const objetivos = await this.prisma.objetivo.findMany({
      where: { userId },
      include: { categoria: true },
    });

    const activos = objetivos.filter(o => !o.completado);
    const completados = objetivos.filter(o => o.completado);

    const totalObjetivo = activos.reduce((sum, o) => sum + o.montoObjetivo, 0);
    const totalActual = activos.reduce((sum, o) => sum + o.montoActual, 0);

    return {
      total: objetivos.length,
      activos: activos.length,
      completados: completados.length,
      totalObjetivo,
      totalActual,
      porcentajeGeneral: totalObjetivo > 0 ? (totalActual / totalObjetivo) * 100 : 0,
      objetivosProximos: objetivos
        .filter(o => !o.completado)
        .sort((a, b) => new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime())
        .slice(0, 3),
      objetivos,
    };
  }

  async getAlertas(userId: number) {
    const objetivos = await this.prisma.objetivo.findMany({
      where: {
        userId,
        completado: false,
        notificaciones: true,
      },
    });

    const alertas = [];
    const now = new Date();

    for (const objetivo of objetivos) {
      const fechaLimite = new Date(objetivo.fechaLimite);
      const diasRestantes = Math.ceil((fechaLimite.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const progreso = (objetivo.montoActual / objetivo.montoObjetivo) * 100;

      if (diasRestantes <= 7 && diasRestantes > 0) {
        alertas.push({
          tipo: 'fecha_limite',
          objetivoId: objetivo.id,
          mensaje: `El objetivo "${objetivo.nombre}" vence en ${diasRestantes} días`,
          urgencia: diasRestantes <= 3 ? 'alta' : 'media',
        });
      }

      if (progreso >= 90 && progreso < 100) {
        alertas.push({
          tipo: 'casi_completo',
          objetivoId: objetivo.id,
          mensaje: `¡Casi completas el objetivo "${objetivo.nombre}"! (${progreso.toFixed(0)}%)`,
          urgencia: 'media',
        });
      }

      if (progreso >= 100) {
        alertas.push({
          tipo: 'completado',
          objetivoId: objetivo.id,
          mensaje: `¡Felicidades! Has completado el objetivo "${objetivo.nombre}"`,
          urgencia: 'baja',
        });
      }
    }

    return alertas;
  }
}