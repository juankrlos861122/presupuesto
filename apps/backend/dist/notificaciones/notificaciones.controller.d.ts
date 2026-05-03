import { NotificacionesService } from './notificaciones.service';
export declare class NotificacionesController {
    private notificacionesService;
    constructor(notificacionesService: NotificacionesService);
    getAlertas(req: any): Promise<any[]>;
    getConfiguracion(req: any): Promise<{
        id: number;
        limiteGastos: number;
        notificacionesEmail: boolean;
        alertas: boolean;
        userId: number;
    }>;
    updateConfiguracion(req: any, config: any): Promise<{
        id: number;
        limiteGastos: number;
        notificacionesEmail: boolean;
        alertas: boolean;
        userId: number;
    }>;
}
