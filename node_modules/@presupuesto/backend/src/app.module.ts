import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TransaccionesModule } from './transacciones/transacciones.module';
import { AhorrosModule } from './ahorros/ahorros.module';
import { ObjetivosModule } from './objetivos/objetivos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ExportModule } from './export/export.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TransaccionesModule,
    AhorrosModule,
    ObjetivosModule,
    CategoriasModule,
    DashboardModule,
    ExportModule,
    NotificacionesModule,
  ],
})
export class AppModule {}