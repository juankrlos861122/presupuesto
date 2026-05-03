import { ObjetivosService } from './objetivos.service';
import { CreateObjetivoDto } from './dto/create-objetivo.dto';
export declare class ObjetivosController {
    private objetivosService;
    constructor(objetivosService: ObjetivosService);
    create(req: any, createObjetivoDto: CreateObjetivoDto): Promise<{
        id: number;
        userId: number;
        nombre: string;
        montoObjetivo: number;
        montoActual: number;
        categoriaId: number | null;
        fechaLimite: Date;
        notificaciones: boolean;
        completado: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(req: any): Promise<({
        categoria: {
            id: number;
            userId: number | null;
            nombre: string;
            createdAt: Date;
            icono: string;
            tipo: string;
            esPersonalizada: boolean;
        };
    } & {
        id: number;
        userId: number;
        nombre: string;
        montoObjetivo: number;
        montoActual: number;
        categoriaId: number | null;
        fechaLimite: Date;
        notificaciones: boolean;
        completado: boolean;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    getProgreso(req: any): Promise<{
        total: number;
        activos: number;
        completados: number;
        totalObjetivo: number;
        totalActual: number;
        porcentajeGeneral: number;
        objetivosProximos: ({
            categoria: {
                id: number;
                userId: number | null;
                nombre: string;
                createdAt: Date;
                icono: string;
                tipo: string;
                esPersonalizada: boolean;
            };
        } & {
            id: number;
            userId: number;
            nombre: string;
            montoObjetivo: number;
            montoActual: number;
            categoriaId: number | null;
            fechaLimite: Date;
            notificaciones: boolean;
            completado: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
        objetivos: ({
            categoria: {
                id: number;
                userId: number | null;
                nombre: string;
                createdAt: Date;
                icono: string;
                tipo: string;
                esPersonalizada: boolean;
            };
        } & {
            id: number;
            userId: number;
            nombre: string;
            montoObjetivo: number;
            montoActual: number;
            categoriaId: number | null;
            fechaLimite: Date;
            notificaciones: boolean;
            completado: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    getAlertas(req: any): Promise<any[]>;
    findOne(req: any, id: string): Promise<{
        categoria: {
            id: number;
            userId: number | null;
            nombre: string;
            createdAt: Date;
            icono: string;
            tipo: string;
            esPersonalizada: boolean;
        };
    } & {
        id: number;
        userId: number;
        nombre: string;
        montoObjetivo: number;
        montoActual: number;
        categoriaId: number | null;
        fechaLimite: Date;
        notificaciones: boolean;
        completado: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(req: any, id: string, updateObjetivoDto: any): Promise<{
        categoria: {
            id: number;
            userId: number | null;
            nombre: string;
            createdAt: Date;
            icono: string;
            tipo: string;
            esPersonalizada: boolean;
        };
    } & {
        id: number;
        userId: number;
        nombre: string;
        montoObjetivo: number;
        montoActual: number;
        categoriaId: number | null;
        fechaLimite: Date;
        notificaciones: boolean;
        completado: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getHistorial(req: any, id: string): Promise<{
        id: number;
        ahorroId: number | null;
        objetivoId: number | null;
        monto: number;
        fecha: Date;
        descripcion: string | null;
    }[]>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}
