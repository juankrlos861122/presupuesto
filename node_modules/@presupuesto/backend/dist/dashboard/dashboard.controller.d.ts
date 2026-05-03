import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getEstadisticas(req: any): Promise<{
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
    getGraficos(req: any, año?: string): Promise<any[]>;
}
