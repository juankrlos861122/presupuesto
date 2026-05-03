import { PrismaService } from '../prisma/prisma.service';
import { CreateObjetivoDto } from './dto/create-objetivo.dto';
export declare class ObjetivosService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, createObjetivoDto: CreateObjetivoDto): Promise<{
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
    findAll(userId: number): Promise<({
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
    findOne(userId: number, id: number): Promise<{
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
    update(userId: number, id: number, updateObjetivoDto: any): Promise<{
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
    getHistorial(userId: number, objetivoId: number): Promise<{
        id: number;
        ahorroId: number | null;
        objetivoId: number | null;
        monto: number;
        fecha: Date;
        descripcion: string | null;
    }[]>;
    remove(userId: number, id: number): Promise<{
        message: string;
    }>;
    getProgreso(userId: number): Promise<{
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
    getAlertas(userId: number): Promise<any[]>;
}
