import { PrismaService } from '../prisma/prisma.service';
export declare class NotificacionesService {
    private prisma;
    constructor(prisma: PrismaService);
    getAlertas(userId: number): Promise<any[]>;
    getConfiguracion(userId: number): Promise<{
        id: number;
        limiteGastos: number;
        notificacionesEmail: boolean;
        alertas: boolean;
        userId: number;
    }>;
    updateConfiguracion(userId: number, config: any): Promise<{
        id: number;
        limiteGastos: number;
        notificacionesEmail: boolean;
        alertas: boolean;
        userId: number;
    }>;
}
