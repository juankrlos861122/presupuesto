import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificacionesService {
  constructor(private prisma: PrismaService) {}

  async getAlertas(userId: number) {
    const alertas = [];
    const now = new Date();

    const configuracion = await this.prisma.configuracion.findUnique({
      where: { userId },
    });

    if (!configuracion?.alertas) {
      return [];
    }

    const mesActual = now.getMonth() + 1;
    const añoActual = now.getFullYear();
    const startOfMonth = new Date(añoActual, mesActual - 1, 1);
    const endOfMonth = new Date(añoActual, mesActual, 0);

    const transacciones = await this.prisma.transaccion.findMany({
      where: {
        userId,
        fecha: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    const ingresos = transacciones.filter(t => t.tipo === 'ingreso').reduce((sum, t) => sum + t.monto, 0);
    const totalGastos = transacciones.filter(t => t.tipo === 'gasto').reduce((sum, t) => sum + t.monto, 0);
    const limiteGastos = ingresos * 0.9;

    if (ingresos > 0 && totalGastos > limiteGastos * 0.8 && totalGastos <= limiteGastos) {
      alertas.push({
        tipo: 'gasto_advertencia',
        titulo: 'Advertencia de Gastos',
        mensaje: `Has usado el ${((totalGastos / limiteGastos) * 100).toFixed(0)}% de tu límite de gastos (90% de tus ingresos)`,
        urgencia: totalGastos > limiteGastos * 0.9 ? 'alta' : 'media',
      });
    }

    if (ingresos > 0 && totalGastos > limiteGastos) {
      alertas.push({
        tipo: 'gasto_excedido',
        titulo: '¡Límite de Gastos Excedido!',
        mensaje: `Has superado el 90% de tus ingresos por $${(totalGastos - limiteGastos).toFixed(0)}`,
        urgencia: 'alta',
      });
    }

    const objetivos = await this.prisma.objetivo.findMany({
      where: { userId, completado: false, notificaciones: true },
    });

    for (const objetivo of objetivos) {
      const fechaLimite = new Date(objetivo.fechaLimite);
      const diasRestantes = Math.ceil((fechaLimite.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const progreso = (objetivo.montoActual / objetivo.montoObjetivo) * 100;

      if (diasRestantes <= 7 && diasRestantes > 0 && progreso < 100) {
        alertas.push({
          tipo: 'objetivo_proximo',
          titulo: 'Objetivo Próximo a Vencer',
          mensaje: `"${objetivo.nombre}" vence en ${diasRestantes} días (${progreso.toFixed(0)}% completado)`,
          urgencia: diasRestantes <= 3 ? 'alta' : 'media',
        });
      }

      if (progreso >= 90 && progreso < 100) {
        alertas.push({
          tipo: 'objetivo_casi',
          titulo: '¡Casi completas tu Objetivo!',
          mensaje: `"${objetivo.nombre}" está al ${progreso.toFixed(0)}%`,
          urgencia: 'baja',
        });
      }
    }

    const ahorros = await this.prisma.ahorro.findMany({ where: { userId } });

    for (const ahorro of ahorros) {
      const progreso = (ahorro.montoActual / ahorro.montoObjetivo) * 100;
      if (progreso >= 100) {
        alertas.push({
          tipo: 'ahorro_completado',
          titulo: '¡Ahorro Completado!',
          mensaje: `¡Felicidades! Has alcanzado tu objetivo de ahorro "${ahorro.nombre}"`,
          urgencia: 'baja',
        });
      }
    }

    return alertas;
  }

  async getConfiguracion(userId: number) {
    return this.prisma.configuracion.findUnique({ where: { userId } });
  }

  async updateConfiguracion(userId: number, config: any) {
    return this.prisma.configuracion.upsert({
      where: { userId },
      update: config,
      create: { userId, ...config },
    });
  }
}