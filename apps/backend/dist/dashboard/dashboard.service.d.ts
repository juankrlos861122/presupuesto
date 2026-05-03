import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getEstadisticas(userId: number): Promise<{
        mesActual: {
            mes: number;
            año: number;
        };
        ingresos: {
            total: number;
            porcentaje: number;
        };
        gastos: {
            total: number;
            porcentaje: number;
            limite: number;
            excedido: boolean;
        };
        balance: number;
        porcentajeAhorro: number;
        ahorros: {
            total: number;
            objetivo: number;
            porcentaje: number;
        };
        objetivos: {
            total: number;
            objetivo: number;
            porcentaje: number;
            cantidad: number;
        };
        ultimosMeses: any[];
    }>;
    getGraficos(userId: number, año?: number): Promise<any[]>;
}
