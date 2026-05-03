import { PrismaService } from '../prisma/prisma.service';
import { CreateTransaccionDto } from './dto/create-transaccion.dto';
export declare class TransaccionesService {
    private prisma;
    constructor(prisma: PrismaService);
    private getIngresosMesActual;
    private getGastosMesActual;
    create(userId: number, createTransaccionDto: CreateTransaccionDto): Promise<{
        categoria: {
            id: number;
            createdAt: Date;
            userId: number | null;
            tipo: string;
            nombre: string;
            icono: string;
            esPersonalizada: boolean;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        tipo: string;
        categoriaId: number;
        monto: number;
        descripcion: string | null;
        fecha: Date;
    }>;
    findAll(userId: number, filters?: {
        mes?: number;
        año?: number;
        tipo?: string;
    }): Promise<({
        categoria: {
            id: number;
            createdAt: Date;
            userId: number | null;
            tipo: string;
            nombre: string;
            icono: string;
            esPersonalizada: boolean;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        tipo: string;
        categoriaId: number;
        monto: number;
        descripcion: string | null;
        fecha: Date;
    })[]>;
    findOne(userId: number, id: number): Promise<{
        categoria: {
            id: number;
            createdAt: Date;
            userId: number | null;
            tipo: string;
            nombre: string;
            icono: string;
            esPersonalizada: boolean;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        tipo: string;
        categoriaId: number;
        monto: number;
        descripcion: string | null;
        fecha: Date;
    }>;
    update(userId: number, id: number, updateTransaccionDto: any): Promise<{
        categoria: {
            id: number;
            createdAt: Date;
            userId: number | null;
            tipo: string;
            nombre: string;
            icono: string;
            esPersonalizada: boolean;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        tipo: string;
        categoriaId: number;
        monto: number;
        descripcion: string | null;
        fecha: Date;
    }>;
    remove(userId: number, id: number): Promise<{
        message: string;
    }>;
    getResumen(userId: number, mes?: number, año?: number): Promise<{
        mes: number;
        año: number;
        totalIngresos: number;
        totalGastos: number;
        balance: number;
        porcentajeAhorro: number;
        gastosPorCategoria: any[];
    }>;
}
